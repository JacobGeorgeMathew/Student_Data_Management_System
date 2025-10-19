// File: internals/handlers/mark_attendance_handler.go
package handlers

import (
	"fmt"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/models"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/services"
	"github.com/gofiber/fiber/v2"
)

type MarkAttendanceHandler struct {
	service services.MarkAttendanceService
}

func NewMarkAttendanceHandler(service services.MarkAttendanceService) *MarkAttendanceHandler {
	return &MarkAttendanceHandler{service: service}
}

// GetSessionInfo handles POST /api/attendance/session-info
func (h *MarkAttendanceHandler) GetSessionInfo(c *fiber.Ctx) error {
	fmt.Println("Request arrived at GetSessionInfo...")

	var req models.SessionInfoRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate required fields
	if req.BranchID == 0 || req.BatchID == 0 || req.SemesterNum == 0 || req.Section == "" || req.Date == "" || req.Hour == 0 {
		return c.Status(400).JSON(fiber.Map{
			"error": "All fields are required",
		})
	}

	response, err := h.service.GetSessionInfo(&req)
	if err != nil {
		fmt.Println("Error:", err)
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(200).JSON(response)
}

// CheckSession handles POST /api/attendance/check-session
func (h *MarkAttendanceHandler) CheckSession(c *fiber.Ctx) error {
	fmt.Println("Request arrived at CheckSession...")

	var req models.CheckSessionRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate required fields
	if req.ClassID == 0 || req.SubjectID == 0 || req.Date == "" || req.Hour == 0 {
		return c.Status(400).JSON(fiber.Map{
			"error": "All fields are required",
		})
	}

	response, err := h.service.CheckSession(&req)
	if err != nil {
		fmt.Println("Error:", err)
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(200).JSON(response)
}

// SubmitAttendance handles POST /api/attendance/submit
func (h *MarkAttendanceHandler) SubmitAttendance(c *fiber.Ctx) error {
	fmt.Println("Request arrived at SubmitAttendance...")

	var req models.SubmitAttendanceRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate required fields
	if req.ClassID == 0 || req.SubjectID == 0 || req.Date == "" || req.Hour == 0 || len(req.Students) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"error": "All fields and at least one student are required",
		})
	}

	// Additional validation for new sessions
	if req.AttendanceResID == nil && (req.BranchID == 0 || req.BatchID == 0) {
		return c.Status(400).JSON(fiber.Map{
			"error": "branch_id and batch_id are required for new sessions",
		})
	}

	response, err := h.service.SubmitAttendance(&req)
	if err != nil {
		fmt.Println("Error:", err)
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(200).JSON(response)
}