package repositories

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/models"
)

type StudentRepository interface {
	RegisterStudent(stud *models.Student) error
	GetStudentByEmail(email string) (*models.Student, error)
	GetStudentByID(id int) (*models.Student, error)
	GetClassID(sem int,b_id int, sec string) (int , error)
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
	query := `INSERT INTO student (name, branch_id, batch_id, class_id, roll_number, email, ph_no, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`

	result , err := r.db.Exec(query,stud.Name,stud.BranchId,stud.BatchId,stud.ClassID,stud.RollNo,stud.Email,stud.PhNo,stud.Password)

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

	err := r.db.QueryRow(query,email).Scan(&stud.StudentId, &stud.Name, &stud.BranchId, &stud.BatchId, &stud.ClassID, &stud.RollNo, &stud.Email , &stud.PhNo, &stud.Password)

	if err != nil {
		return nil , err
	}

	return stud , nil
}

func (r *studRepo) GetStudentByID(id int) (*models.Student, error) {
	stud := &models.Student{}
	query := `SELECT * FROM student WHERE student_id = ?`

	err := r.db.QueryRow(query,id).Scan(&stud.StudentId, &stud.Name, &stud.BranchId, &stud.BatchId, &stud.ClassID, &stud.RollNo, &stud.Email , &stud.PhNo, &stud.Password)

	if err != nil {
		return nil , err
	}

	return stud,nil
}

func (r* studRepo) GetClassID(sem int,b_id int, sec string) (int , error) {
	var sem_id int
	var class_id int
	fmt.Println("GetClassID ",sem,b_id,sec)
	query := `SELECT semester_id from semester where sem_num = ? and branch_id = ?`

	err := r.db.QueryRow(query,sem,b_id).Scan(&sem_id)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, sql.ErrNoRows
		}
		return 0, err
	}

	query2 := `SELECT class_id from class WHERE semester_id = ? and section =?`

	err = r.db.QueryRow(query2,sem_id,sec).Scan(&class_id)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, sql.ErrNoRows
		}
		return 0, err
	}

	return class_id,nil
}