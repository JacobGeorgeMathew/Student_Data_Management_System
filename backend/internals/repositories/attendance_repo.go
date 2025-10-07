package repositories

import (
	"database/sql"
	"fmt"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/models"
)

type AttendanceRepo interface {
	GetStudentAttendanceByID(studentID int) ([]models.AttendanceRecord, error)
}

type attendanceRepo struct {
	db *sql.DB
}

func NewAttendanceRepo(db *sql.DB) AttendanceRepo {
	return &attendanceRepo{db: db}
}

func (r *attendanceRepo) GetStudentAttendanceByID(studentID int) ([]models.AttendanceRecord, error) {
	query := `
		SELECT 
			sub.subject_id,
			sub.name AS subject_name,
			sub.code AS subject_code,
			COALESCE(SUM(CASE WHEN ai.status = 1 THEN 1 ELSE 0 END), 0) AS present_days,
			COUNT(ai.attendance_id) AS total_days,
			sem.sem_num
		FROM student s
		INNER JOIN class c ON s.class_id = c.class_id
		INNER JOIN semester sem ON c.semester_id = sem.semester_id
		INNER JOIN subject_cluster sc ON sem.subject_cluster_id = sc.subject_cluster_id
		INNER JOIN subject sub ON sc.subject_id = sub.subject_id
		LEFT JOIN attendance_resource ar ON ar.class_id = c.class_id AND ar.subject_id = sub.subject_id
		LEFT JOIN attendance_info ai ON ai.attendance_res_id = ar.attendance_res_id AND ai.student_id = s.student_id
		WHERE s.student_id = ?
		GROUP BY sub.subject_id, sub.name, sub.code, sem.sem_num
		ORDER BY sem.sem_num DESC, sub.name ASC
	`

	rows, err := r.db.Query(query, studentID)
	if err != nil {
		return nil, fmt.Errorf("failed to query attendance: %w", err)
	}
	defer rows.Close()

	var records []models.AttendanceRecord
	for rows.Next() {
		var record models.AttendanceRecord
		err := rows.Scan(
			&record.SubjectID,
			&record.SubjectName,
			&record.SubjectCode,
			&record.PresentDays,
			&record.TotalDays,
			&record.SemesterNum,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan attendance record: %w", err)
		}
		records = append(records, record)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating attendance records: %w", err)
	}

	return records, nil
}