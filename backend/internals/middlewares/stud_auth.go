package middlewares

import (
	"fmt"
	"time"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/utils"
	"github.com/gofiber/fiber/v2"
)

// 🔥 Alternative: Cookie-only auth middleware (more secure)
func CookieAuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Only accept tokens from cookies (no Authorization header)
		tokenString := c.Cookies("jwt_token")
		
		if tokenString == "" {
			return c.Status(401).JSON(fiber.Map{
				"error": "Authentication cookie required",
			})
		}

		// Validate token
		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			// Clear invalid cookie
			c.Cookie(&fiber.Cookie{
				Name:     "jwt_token",
				Value:    "",
				Expires:  time.Now().Add(-time.Hour),
				HTTPOnly: true,
			})
			
			return c.Status(401).JSON(fiber.Map{
				"error": "Invalid authentication cookie",
			})
		}

		// Store user ID in context
		c.Locals("userID", claims.UserID)
		return c.Next()
	}
}

func RoleCheckMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Only accept tokens from cookies (no Authorization header)
		tokenString := c.Cookies("jwt_token")
		
		if tokenString == "" {
			return c.Status(401).JSON(fiber.Map{
				"error": "Authentication cookie required",
			})
		}

		// Validate token
		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			// Clear invalid cookie
			c.Cookie(&fiber.Cookie{
				Name:     "jwt_token",
				Value:    "",
				Expires:  time.Now().Add(-time.Hour),
				HTTPOnly: true,
			})
			
			return c.Status(401).JSON(fiber.Map{
				"error": "Invalid authentication cookie",
			})
		}
		fmt.Println("RoleCheckMiddleware...",claims.Role);
		return c.Status(200).JSON(fiber.Map{
			"role": claims.Role,
		})
	}	
}