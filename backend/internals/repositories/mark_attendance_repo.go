// File: internals/repositories/mark_attendance_repo.go
package repositories

import (
	"database/sql"
	"fmt"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/models"
)

type MarkAttendanceRepo interface {
	GetSessionInfo(branchID, semesterNum int, section string) (*models.SessionInfoResponse, error)
	GetSubjectsByCluster(clusterID int) ([]models.SubjectInfo, error)
	CheckExistingSession(classID, subjectID int, date string, hour int) (*int, error)
	GetStudentsByClass(classID int) ([]models.StudentAttendanceInfo, error)
	GetAttendanceBySession(attendanceResID int) ([]models.StudentAttendanceInfo, error)
	CreateAttendanceResource(batchID, classID, subjectID int, date string, hour int) (int, error)
	InsertAttendanceInfo(attendanceResID int, students []models.StudentAttendance) error
	UpdateAttendanceInfo(attendanceResID int, students []models.StudentAttendance) error
}

type markAttendanceRepo struct {
	db *sql.DB
}

func NewMarkAttendanceRepo(db *sql.DB) MarkAttendanceRepo {
	return &markAttendanceRepo{db: db}
}

// GetSessionInfo fetches semester_id and class_id
func (r *markAttendanceRepo) GetSessionInfo(branchID, semesterNum int, section string) (*models.SessionInfoResponse, error) {
	query := `
		SELECT 
			sem.semester_id,
			sem.subject_cluster_id,
			c.class_id
		FROM semester sem
		INNER JOIN class c ON c.semester_id = sem.semester_id
		WHERE sem.branch_id = ? 
			AND sem.sem_num = ? 
			AND c.section = ?
		LIMIT 1
	`

	var semesterID, clusterID, classID int
	err := r.db.QueryRow(query, branchID, semesterNum, section).Scan(&semesterID, &clusterID, &classID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no matching semester or class found")
		}
		return nil, fmt.Errorf("failed to get session info: %w", err)
	}

	return &models.SessionInfoResponse{
		SemesterID: semesterID,
		ClassID:    classID,
	}, nil
}

// GetSubjectsByCluster fetches all subjects under a cluster
func (r *markAttendanceRepo) GetSubjectsByCluster(clusterID int) ([]models.SubjectInfo, error) {
	query := `
		SELECT 
			s.subject_id,
			s.name
		FROM subject s
		INNER JOIN subject_cluster_map scm ON s.subject_id = scm.subject_id
		WHERE scm.subject_cluster_id = ?
		ORDER BY s.name
	`

	rows, err := r.db.Query(query, clusterID)
	if err != nil {
		return nil, fmt.Errorf("failed to get subjects: %w", err)
	}
	defer rows.Close()

	var subjects []models.SubjectInfo
	for rows.Next() {
		var subject models.SubjectInfo
		if err := rows.Scan(&subject.SubjectID, &subject.SubjectName); err != nil {
			return nil, fmt.Errorf("failed to scan subject: %w", err)
		}
		subjects = append(subjects, subject)
	}

	return subjects, nil
}

// CheckExistingSession checks if attendance already exists
func (r *markAttendanceRepo) CheckExistingSession(classID, subjectID int, date string, hour int) (*int, error) {
	query := `
		SELECT attendance_res_id 
		FROM attendance_resource
		WHERE class_id = ? 
			AND subject_id = ? 
			AND attendance_date = ? 
			AND hour = ?
		LIMIT 1
	`

	var attendanceResID int
	err := r.db.QueryRow(query, classID, subjectID, date, hour).Scan(&attendanceResID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // No existing session
		}
		return nil, fmt.Errorf("failed to check session: %w", err)
	}

	return &attendanceResID, nil
}

// GetStudentsByClass fetches all students in a class
func (r *markAttendanceRepo) GetStudentsByClass(classID int) ([]models.StudentAttendanceInfo, error) {
	query := `
		SELECT 
			s.student_id,
			s.name
		FROM student s
		INNER JOIN student_class sc ON s.student_id = sc.student_id
		WHERE sc.class_id = ?
		ORDER BY s.name
	`

	rows, err := r.db.Query(query, classID)
	if err != nil {
		return nil, fmt.Errorf("failed to get students: %w", err)
	}
	defer rows.Close()

	var students []models.StudentAttendanceInfo
	for rows.Next() {
		var student models.StudentAttendanceInfo
		if err := rows.Scan(&student.StudentID, &student.Name); err != nil {
			return nil, fmt.Errorf("failed to scan student: %w", err)
		}
		students = append(students, student)
	}

	return students, nil
}

// GetAttendanceBySession fetches attendance records for existing session
func (r *markAttendanceRepo) GetAttendanceBySession(attendanceResID int) ([]models.StudentAttendanceInfo, error) {
	query := `
		SELECT 
			s.student_id,
			s.name,
			ai.status
		FROM attendance_info ai
		INNER JOIN student s ON ai.student_id = s.student_id
		WHERE ai.attendance_res_id = ?
		ORDER BY s.name
	`

	rows, err := r.db.Query(query, attendanceResID)
	if err != nil {
		return nil, fmt.Errorf("failed to get attendance: %w", err)
	}
	defer rows.Close()

	var students []models.StudentAttendanceInfo
	for rows.Next() {
		var student models.StudentAttendanceInfo
		var status int
		if err := rows.Scan(&student.StudentID, &student.Name, &status); err != nil {
			return nil, fmt.Errorf("failed to scan attendance: %w", err)
		}
		student.Status = &status
		students = append(students, student)
	}

	return students, nil
}

// CreateAttendanceResource creates new attendance session
func (r *markAttendanceRepo) CreateAttendanceResource(batchID, classID, subjectID int, date string, hour int) (int, error) {
	query := `
		INSERT INTO attendance_resource (batch_id, class_id, subject_id, attendance_date, hour)
		VALUES (?, ?, ?, ?, ?)
	`

	result, err := r.db.Exec(query, batchID, classID, subjectID, date, hour)
	if err != nil {
		return 0, fmt.Errorf("failed to create attendance resource: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("failed to get last insert id: %w", err)
	}

	return int(id), nil
}

// InsertAttendanceInfo inserts attendance records
func (r *markAttendanceRepo) InsertAttendanceInfo(attendanceResID int, students []models.StudentAttendance) error {
	query := `
		INSERT INTO attendance_info (attendance_res_id, student_id, status)
		VALUES (?, ?, ?)
	`

	stmt, err := r.db.Prepare(query)
	if err != nil {
		return fmt.Errorf("failed to prepare statement: %w", err)
	}
	defer stmt.Close()

	for _, student := range students {
		_, err := stmt.Exec(attendanceResID, student.StudentId, student.Status)
		if err != nil {
			return fmt.Errorf("failed to insert attendance for student %d: %w", student.StudentId, err)
		}
	}

	return nil
}

// UpdateAttendanceInfo updates existing attendance records
func (r *markAttendanceRepo) UpdateAttendanceInfo(attendanceResID int, students []models.StudentAttendance) error {
	query := `
		UPDATE attendance_info 
		SET status = ?
		WHERE attendance_res_id = ? AND student_id = ?
	`

	stmt, err := r.db.Prepare(query)
	if err != nil {
		return fmt.Errorf("failed to prepare statement: %w", err)
	}
	defer stmt.Close()

	for _, student := range students {
		_, err := stmt.Exec(student.Status, attendanceResID, student.StudentId)
		if err != nil {
			return fmt.Errorf("failed to update attendance for student %d: %w", student.StudentId, err)
		}
	}

	return nil
}