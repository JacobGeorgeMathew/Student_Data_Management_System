package main

import (
	"fmt"
	"log"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/config"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/database"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/handlers"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/middlewares"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/repositories"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/services"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	fmt.Println("Hello World")

	cfg := config.LoadConfig()

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Student repositories, services, and handlers
	studRepo := repositories.NewStudRepo(db)
	studService := services.NewAuthService(studRepo)
	studHandler := handlers.NewAuthHandler(studService)

	// Teacher repositories, services, and handlers
	teacherRepo := repositories.NewTeacherRepo(db)
	teacherService := services.NewTeacherAuthService(teacherRepo)
	teacherHandler := handlers.NewTeacherAuthHandler(teacherService)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000,http://localhost:5173", // Your frontend URLs
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: true, // 🔥 IMPORTANT: Allow cookies to be sent
	}))

	api := app.Group("/api")

	// Student routes (PUBLIC - no middleware)
	stud := api.Group("/student")
	stud.Post("/register", studHandler.Register)
	stud.Post("/login", studHandler.Login)
	stud.Post("/logout", studHandler.Logout)

	// Student protected routes (with middleware)
	stud_protected := api.Group("/student", middlewares.CookieAuthMiddleware())
	stud_protected.Get("/details", studHandler.GetMe)

	// Teacher routes (PUBLIC - no middleware)
	teacher := api.Group("/teacher")
	teacher.Post("/register", teacherHandler.Register)
	teacher.Post("/login", teacherHandler.Login)
	teacher.Post("/logout", teacherHandler.Logout)

	// Teacher protected routes (with middleware)
	teacher_protected := api.Group("/teacher", middlewares.CookieAuthMiddleware())
	teacher_protected.Get("/details", teacherHandler.GetMe)

	fmt.Println("Server Started")
	log.Fatal(app.Listen("localhost:5000"))
}