package models

import (
	"time"
)

type StudentAttendance struct {
    StudentId int `json:"student_id" db:"student_id"`
    Status    int `json:"status" db:"status"`
}

type MarkAttendance struct {
    BatchId   int                `json:"batch_id" db:"batch_id"`
    SubjectId int                `json:"subject_id" db:"subject_id"`
    Date      time.Time          `json:"attendance_date" db:"attendance_date"`
    Hour      int                `json:"hour" db:"hour"`
    Students  []StudentAttendance `json:"students"`
}
