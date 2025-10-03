package handlers

import (
	"fmt"
	"time"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/models"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/services"
	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	authService services.StudAuthService
}

func NewAuthHandler(authService services.StudAuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	fmt.Println("Request Arrived at Student Register...")
	var req models.StudRegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Basic validation
	if req.Email == "" || req.Password == "" || req.Name == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Email, username, and password are required",
		})
	}

	response, err := h.authService.Register(&req)
	if err != nil {
		fmt.Println(err)
		return c.Status(400).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// 🍪 SET JWT TOKEN AS HTTP-ONLY COOKIE
	h.setTokenCookie(c, response.Token)

	// Don't send token in response body when using cookies
	return c.Status(201).JSON(fiber.Map{
		"message": "Registration successful",
		"user":    response.Stud,
	})
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req models.StudSigninRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Basic validation
	if req.Email == "" || req.Password == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Email and password are required",
		})
	}

	response, err := h.authService.Login(&req)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// 🍪 SET JWT TOKEN AS HTTP-ONLY COOKIE
	h.setTokenCookie(c, response.Token)

	return c.JSON(fiber.Map{
		"message": "Login successful",
		"user":    response.Stud,
	})
}

func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	// Clear the JWT cookie by setting it to expire in the past
	c.Cookie(&fiber.Cookie{
		Name:     "jwt_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour), // Expire in the past
		HTTPOnly: true,
		Secure:   false, // Use in production with HTTPS
		SameSite: "Strict",
	})

	return c.JSON(fiber.Map{
		"message": "Logout successful",
	})
}

// 🔥 NEW: Get current user info (useful for frontend)
func (h *AuthHandler) GetMe(c *fiber.Ctx) error {
	fmt.Println("Request Arrived at student GetMe..")
	studID, ok := c.Locals("userID").(int)
	if !ok {
		return c.Status(401).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}


	stud, err := h.authService.GetStudentByID(studID)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "User not found",
		})
	}
  return c.JSON(fiber.Map{
		"user": stud,
	})
}

func (h *AuthHandler) setTokenCookie(c *fiber.Ctx, token string) {
	c.Cookie(&fiber.Cookie{
		Name:     "jwt_token",           // Cookie name
		Value:    token,                 // JWT token
		Expires:  time.Now().Add(24 * time.Hour), // 24 hours
		HTTPOnly: true,                  // 🔒 Cannot be accessed by JavaScript (XSS protection)
		Secure:   false,                  // 🔒 Only sent over HTTPS (set to false for development)
		SameSite: "Strict",             // 🔒 CSRF protection
		Path:     "/",                   // Available for all routes
	})
}