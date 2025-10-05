package models

type TeacherSigninRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type TeacherRegisterRequest struct {
	Name     string `json:"name" db:"name"`
	Email    string `json:"email" db:"email"`
	PhNo     string `json:"ph_no" db:"ph_no"`
	Password string `json:"password" db:"password"`
}

type Teacher struct {
	TeacherId int    `json:"id" db:"teacher_id"`
	Name      string `json:"name" db:"name"`
	Email     string `json:"email" db:"email"`
	PhNo      string `json:"ph_no" db:"ph_no"`
	Password  string `json:"password" db:"password"`
}

type TeacherAuthResponse struct {
	Token   string  `json:"token"`
	Teacher Teacher `json:"teacher"`
}