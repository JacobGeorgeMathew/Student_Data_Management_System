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

// Models for fetching student attendance details
type SubjectAttendanceDetail struct {
	ID           int     `json:"id" db:"subject_id"`
	SubjectName  string  `json:"subjectName" db:"subject_name"`
	SubjectCode  string  `json:"subjectCode" db:"subject_code"`
	PresentDays  int     `json:"presentDays" db:"present_days"`
	TotalDays    int     `json:"totalDays" db:"total_days"`
	Percentage   float64 `json:"percentage"`
	Status       string  `json:"status"`
}

type AttendanceRecord struct {
	SubjectID   int `db:"subject_id"`
	SubjectName string `db:"subject_name"`
	SubjectCode string `db:"subject_code"`
	PresentDays int `db:"present_days"`
	TotalDays   int `db:"total_days"`
	SemesterNum int `db:"sem_num"`
}

type SemesterAttendanceResponse map[string][]SubjectAttendanceDetail