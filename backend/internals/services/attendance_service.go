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

	// Group records by semester and subject
	type SubjectKey struct {
		SemesterNum int
		SubjectID   int
	}

	subjectMap := make(map[SubjectKey]*models.SubjectAttendanceDetail)
	
	for _, record := range records {
		key := SubjectKey{
			SemesterNum: record.SemesterNum,
			SubjectID:   record.SubjectID,
		}

		// Initialize subject detail if not exists
		if _, exists := subjectMap[key]; !exists {
			subjectMap[key] = &models.SubjectAttendanceDetail{
				ID:          record.SubjectID,
				SubjectName: record.SubjectName,
				SubjectCode: record.SubjectCode,
				PresentDays: 0,
				TotalDays:   0,
				Sessions:    []models.AttendanceSession{},
			}
		}

		subject := subjectMap[key]

		// Add session if date, hour, and status are present
		if record.Date != nil && record.Hour != nil && record.Status != nil {
			session := models.AttendanceSession{
				Date:   *record.Date,
				Hour:   *record.Hour,
				Status: *record.Status,
			}
			subject.Sessions = append(subject.Sessions, session)
			subject.TotalDays++
			
			if *record.Status == 1 {
				subject.PresentDays++
			}
		}
	}

	// Calculate percentages and group by semester
	response := make(models.SemesterAttendanceResponse)

	for key, subject := range subjectMap {
		semesterKey := fmt.Sprintf("Semester %d", key.SemesterNum)

		// Calculate percentage
		var percentage float64
		if subject.TotalDays > 0 {
			percentage = (float64(subject.PresentDays) / float64(subject.TotalDays)) * 100
		}

		// Set calculated fields
		subject.Percentage = roundToOneDecimal(percentage)
		subject.Status = s.getAttendanceStatus(percentage)

		// Append to the appropriate semester
		response[semesterKey] = append(response[semesterKey], *subject)
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