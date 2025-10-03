package repositories

import (
	"database/sql"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/models"
)

type StudentRepository interface {
	RegisterStudent(stud *models.Student) error
	GetStudentByEmail(email string) (*models.Student, error)
	GetStudentByID(id int) (*models.Student, error)
}

type studRepo struct {
	db *sql.DB
}

func NewStudRepo(db *sql.DB) *studRepo  {
	return &studRepo{
		db: db,
	}
}

func (r *studRepo) RegisterStudent(stud *models.Student) error {
	query := `INSERT INTO student (name, branch_id, batch_id, roll_number, email, ph_no, password) VALUES(?, ?, ?, ?, ?, ?, ?)`

	result , err := r.db.Exec(query,stud.Name,stud.BranchId,stud.BatchId,stud.RollNo,stud.Email,stud.PhNo,stud.Password)

	if err != nil {
		return err
	}
	
	id, err := result.LastInsertId()
	if err != nil {
		return err
	}
	
	stud.StudentId = int(id)
	return nil
}

func (r *studRepo) GetStudentByEmail(email string) (*models.Student, error) {
	stud := &models.Student{}
	query := `SELECT * FROM student WHERE email = ?`

	err := r.db.QueryRow(query,email).Scan(&stud.StudentId, &stud.Name, &stud.BranchId, &stud.BatchId, &stud.RollNo, &stud.Email , &stud.PhNo, &stud.Password)

	if err != nil {
		return nil , err
	}

	return stud , nil
}

func (r *studRepo) GetStudentByID(id int) (*models.Student, error) {
	stud := &models.Student{}
	query := `SELECT * FROM student WHERE student_id = ?`

	err := r.db.QueryRow(query,id).Scan(&stud.StudentId, &stud.Name, &stud.BranchId, &stud.BatchId, &stud.RollNo, &stud.Email , &stud.PhNo, &stud.Password)

	if err != nil {
		return nil , err
	}

	return stud,nil
}