package models

import (
	"time"
)

type StudentAttendance struct {
	StudentId int `json:"student_id" db:"student_id"`
	Status    int `json:"status" db:"status"`
}

type MarkAttendance struct {
	BatchId   int                 `json:"batch_id" db:"batch_id"`
	SubjectId int                 `json:"subject_id" db:"subject_id"`
	Date      time.Time           `json:"attendance_date" db:"attendance_date"`
	Hour      int                 `json:"hour" db:"hour"`
	Students  []StudentAttendance `json:"students"`
}

// AttendanceSession represents a single attendance session with date and hour
type AttendanceSession struct {
	Date   string `json:"date" db:"attendance_date"`     // Format: "2006-01-02"
	Hour   int    `json:"hour" db:"hour"`                // Hour number (1-8)
	Status int    `json:"status" db:"status"`            // 1 = Present, 0 = Absent
}

// SubjectAttendanceDetail contains attendance details for a subject
type SubjectAttendanceDetail struct {
	ID          int                 `json:"id" db:"subject_id"`
	SubjectName string              `json:"subjectName" db:"subject_name"`
	SubjectCode string              `json:"subjectCode" db:"subject_code"`
	PresentDays int                 `json:"presentDays"`
	TotalDays   int                 `json:"totalDays"`
	Percentage  float64             `json:"percentage"`
	Status      string              `json:"status"`
	Sessions    []AttendanceSession `json:"sessions"` // All attendance sessions
}

// AttendanceRecord is the raw data from database
type AttendanceRecord struct {
	SubjectID   int       `db:"subject_id"`
	SubjectName string    `db:"subject_name"`
	SubjectCode string    `db:"subject_code"`
	SemesterNum int       `db:"sem_num"`
	Date        *string   `db:"attendance_date"` // Nullable
	Hour        *int      `db:"hour"`            // Nullable
	Status      *int      `db:"status"`          // Nullable (1=Present, 0=Absent, NULL=no record)
}

// SemesterAttendanceResponse maps semester names to subject attendance details
type SemesterAttendanceResponse map[string][]SubjectAttendanceDetail