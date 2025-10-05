package repositories

import (
	"database/sql"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/models"
)

type TeacherRepository interface {
	RegisterTeacher(teacher *models.Teacher) error
	GetTeacherByEmail(email string) (*models.Teacher, error)
	GetTeacherByID(id int) (*models.Teacher, error)
}

type teacherRepo struct {
	db *sql.DB
}

func NewTeacherRepo(db *sql.DB) *teacherRepo {
	return &teacherRepo{
		db: db,
	}
}

func (r *teacherRepo) RegisterTeacher(teacher *models.Teacher) error {
	query := `INSERT INTO teacher (name, email, ph_no, password) VALUES(?, ?, ?, ?)`

	result, err := r.db.Exec(query, teacher.Name, teacher.Email, teacher.PhNo, teacher.Password)

	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	teacher.TeacherId = int(id)
	return nil
}

func (r *teacherRepo) GetTeacherByEmail(email string) (*models.Teacher, error) {
	teacher := &models.Teacher{}
	query := `SELECT * FROM teacher WHERE email = ?`

	err := r.db.QueryRow(query, email).Scan(&teacher.TeacherId, &teacher.Name, &teacher.Email, &teacher.PhNo, &teacher.Password)

	if err != nil {
		return nil, err
	}

	return teacher, nil
}

func (r *teacherRepo) GetTeacherByID(id int) (*models.Teacher, error) {
	teacher := &models.Teacher{}
	query := `SELECT * FROM teacher WHERE teacher_id = ?`

	err := r.db.QueryRow(query, id).Scan(&teacher.TeacherId, &teacher.Name, &teacher.Email, &teacher.PhNo, &teacher.Password)

	if err != nil {
		return nil, err
	}

	return teacher, nil
}