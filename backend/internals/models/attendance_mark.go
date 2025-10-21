// File: internals/models/attendance_mark.go
package models

// SessionInfoRequest - Request to get session information
type SessionInfoRequest struct {
	BranchID    int    `json:"branch_id"`
	BatchID     int    `json:"batch_id"`
	SemesterNum int    `json:"semester_num"`
	Section     string `json:"section"`
	Date        string `json:"date"`
	Hour        int    `json:"hour"`
}

// SubjectInfo - Subject details
type SubjectInfo struct {
	SubjectID   int    `json:"subject_id"`
	SubjectName string `json:"subject_name"`
}

// SessionInfoResponse - Response with session details and subjects
type SessionInfoResponse struct {
	BranchID    int           `json:"branch_id"`
	BatchID     int           `json:"batch_id"`
	ClusterID   int 					`json:"cluster_id"`
	SemesterNum int           `json:"semester_num"`
	Section     string        `json:"section"`
	Date        string        `json:"date"`
	Hour        int           `json:"hour"`
	SemesterID  int           `json:"semester_id"`
	ClassID     int           `json:"class_id"`
	Subjects    []SubjectInfo `json:"subjects"`
}

// CheckSessionRequest - Request to check if session exists
type CheckSessionRequest struct {
	ClassID   int    `json:"class_id"`
	SubjectID int    `json:"subject_id"`
	Date      string `json:"date"`
	Hour      int    `json:"hour"`
}

// StudentAttendanceInfo - Student info with optional status
type StudentAttendanceInfo struct {
	StudentID int     `json:"student_id"`
	Name      string  `json:"name"`
	Status    *int    `json:"status,omitempty"`
}

// CheckSessionResponse - Response with existing or new session info
type CheckSessionResponse struct {
	AttendanceResID *int                    `json:"attendance_res_id"`
	Students        []StudentAttendanceInfo `json:"students"`
}

// SubmitAttendanceRequest - Request to submit attendance
type SubmitAttendanceRequest struct {
	AttendanceResID *int                `json:"attendance_res_id"`
	BranchID        int                 `json:"branch_id"`
	BatchID         int                 `json:"batch_id"`
	ClassID         int                 `json:"class_id"`
	SubjectID       int                 `json:"subject_id"`
	Date            string              `json:"date"`
	Hour            int                 `json:"hour"`
	Students        []StudentAttendance `json:"students"`
}

// SubmitAttendanceResponse - Response after submitting attendance
type SubmitAttendanceResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}