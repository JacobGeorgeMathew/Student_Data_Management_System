package services

import (
	"fmt"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/models"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/repositories"
)

type AttendanceService interface {
	GetStudentAttendanceDetails(studentID int) (models.SemesterAttendanceResponse, error)
}

type attendanceService struct {
	attendanceRepo repositories.AttendanceRepo
}

func NewAttendanceService(attendanceRepo repositories.AttendanceRepo) AttendanceService {
	return &attendanceService{attendanceRepo: attendanceRepo}
}

func (s *attendanceService) GetStudentAttendanceDetails(studentID int) (models.SemesterAttendanceResponse, error) {
	// Fetch raw attendance records from repository
	records, err := s.attendanceRepo.GetStudentAttendanceByID(studentID)
	if err != nil {
		return nil, fmt.Errorf("failed to get attendance records: %w", err)
	}

	// Group records by semester and calculate percentages
	response := make(models.SemesterAttendanceResponse)

	for _, record := range records {
		semesterKey := fmt.Sprintf("Semester %d", record.SemesterNum)

		// Calculate percentage
		var percentage float64
		if record.TotalDays > 0 {
			percentage = (float64(record.PresentDays) / float64(record.TotalDays)) * 100
		}

		// Determine status based on percentage
		status := s.getAttendanceStatus(percentage)

		// Create subject attendance detail
		detail := models.SubjectAttendanceDetail{
			ID:          record.SubjectID,
			SubjectName: record.SubjectName,
			SubjectCode: record.SubjectCode,
			PresentDays: record.PresentDays,
			TotalDays:   record.TotalDays,
			Percentage:  roundToOneDecimal(percentage),
			Status:      status,
		}

		// Append to the appropriate semester
		response[semesterKey] = append(response[semesterKey], detail)
	}

	return response, nil
}

func (s *attendanceService) getAttendanceStatus(percentage float64) string {
	switch {
	case percentage >= 90:
		return "excellent"
	case percentage >= 75:
		return "good"
	case percentage >= 60:
		return "average"
	case percentage >= 50:
		return "warning"
	default:
		return "critical"
	}
}

func roundToOneDecimal(val float64) float64 {
	return float64(int(val*10+0.5)) / 10
}