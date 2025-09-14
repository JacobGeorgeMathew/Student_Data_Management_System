package models

type StudSigninRequest struct {
  Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type StudSignupRequest struct {

}

type StudAttendanceRequest struct {

}

type Student struct {
	StudentId int `json:"id" db:"student_id"`
	Name string `json:"name" db:"name"`
	Email string `json:"email" db:"email"`
	PhNo string `json:"ph_no" db:"ph_no"`
	RollNo int `json:"roll_number" db:"roll_number"`
	BatchId int `json:"batch_id" db:"batch_id"`
	BranchId int `json:"branch_id" db:"branch_id"`
	Password string `json:"password" db:"password"`
}