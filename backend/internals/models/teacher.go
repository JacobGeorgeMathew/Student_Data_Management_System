package models

type TeacherSignupRequest struct {

}

type TeacherSigninRequest struct {

}

type Teacher struct {
	TeacherId int `json:"teacher_id" db:"teacher_id"`
	Name string `json:"name" db:"name"`
	Email string `json:"email" db:"email"`
	PhNo string `json:"ph_no" db:"ph_no"`
	Password string `json:"password" db:"password"`
}