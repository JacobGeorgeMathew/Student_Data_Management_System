package main

import (
	"fmt"
	"log"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/config"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/database"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/handlers"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/repositories"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/services"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main()  {
	fmt.Println("Hello World")

	cfg := config.LoadConfig()

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	studRepo := repositories.NewStudRepo(db)

	studService := services.NewAuthService(studRepo)

	studHandler := handlers.NewAuthHandler(studService)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000,http://localhost:5173", // Your frontend URLs
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: true, // 🔥 IMPORTANT: Allow cookies to be sent
	}))

	api := app.Group("/api")

	stud := api.Group("/student")
	//teacher := api.Group("/teacher")

	//teacher.Post("/register")
	//teacher.Post("/login")

	stud.Post("/register",studHandler.Register)
	stud.Post("/login",studHandler.Login)

	//teacher.Get("/home")

	//stud.Get("/home")

	fmt.Println("Server Started")
	log.Fatal(app.Listen("localhost:5000"))
}