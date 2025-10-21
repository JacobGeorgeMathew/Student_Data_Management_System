// File: internals/services/mark_attendance_service.go
package services

import (
	"fmt"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/models"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/repositories"
)

type MarkAttendanceService interface {
	GetSessionInfo(req *models.SessionInfoRequest) (*models.SessionInfoResponse, error)
	CheckSession(req *models.CheckSessionRequest) (*models.CheckSessionResponse, error)
	SubmitAttendance(req *models.SubmitAttendanceRequest) (*models.SubmitAttendanceResponse, error)
}

type markAttendanceService struct {
	repo repositories.MarkAttendanceRepo
}

func NewMarkAttendanceService(repo repositories.MarkAttendanceRepo) MarkAttendanceService {
	return &markAttendanceService{repo: repo}
}

// GetSessionInfo retrieves session details and subjects
func (s *markAttendanceService) GetSessionInfo(req *models.SessionInfoRequest) (*models.SessionInfoResponse, error) {
	// Get semester_id and class_id
	sessionInfo, err := s.repo.GetSessionInfo(req.BranchID, req.SemesterNum, req.Section)
	if err != nil {
		return nil, err
	}

	fmt.Println("ClusterID: ",sessionInfo.ClusterID)

	// Get subjects for the cluster
	subjects, err := s.repo.GetSubjectsByCluster(sessionInfo.ClusterID)
	if err != nil {
		return nil, err
	}

	fmt.Println("Subjects: ",subjects)

	// Build complete response
	response := &models.SessionInfoResponse{
		BranchID:    req.BranchID,
		BatchID:     req.BatchID,
		SemesterNum: req.SemesterNum,
		Section:     req.Section,
		Date:        req.Date,
		Hour:        req.Hour,
		SemesterID:  sessionInfo.SemesterID,
		ClassID:     sessionInfo.ClassID,
		Subjects:    subjects,
	}

	return response, nil
}

// CheckSession checks if attendance exists and returns students
func (s *markAttendanceService) CheckSession(req *models.CheckSessionRequest) (*models.CheckSessionResponse, error) {
	// Check if session already exists
	attendanceResID, err := s.repo.CheckExistingSession(req.ClassID, req.SubjectID, req.Date, req.Hour)
	if err != nil {
		return nil, err
	}

	var students []models.StudentAttendanceInfo

	if attendanceResID != nil {
		// Session exists - get attendance records
		students, err = s.repo.GetAttendanceBySession(*attendanceResID)
		if err != nil {
			return nil, err
		}
	} else {
		// New session - get all students in class
		students, err = s.repo.GetStudentsByClass(req.ClassID)
		if err != nil {
			return nil, err
		}
	}

	return &models.CheckSessionResponse{
		AttendanceResID: attendanceResID,
		Students:        students,
	}, nil
}

// SubmitAttendance creates or updates attendance records
func (s *markAttendanceService) SubmitAttendance(req *models.SubmitAttendanceRequest) (*models.SubmitAttendanceResponse, error) {
	if req.AttendanceResID == nil {
		// Create new attendance session
		attendanceResID, err := s.repo.CreateAttendanceResource(
			req.BatchID,
			req.ClassID,
			req.SubjectID,
			req.Date,
			req.Hour,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to create attendance session: %w", err)
		}

		// Insert attendance records
		err = s.repo.InsertAttendanceInfo(attendanceResID, req.Students)
		if err != nil {
			return nil, fmt.Errorf("failed to insert attendance records: %w", err)
		}
	} else {
		// Update existing attendance records
		err := s.repo.UpdateAttendanceInfo(*req.AttendanceResID, req.Students)
		if err != nil {
			return nil, fmt.Errorf("failed to update attendance records: %w", err)
		}
	}

	return &models.SubmitAttendanceResponse{
		Success: true,
		Message: "Attendance saved successfully",
	}, nil
}