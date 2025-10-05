package services

import (
	"errors"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/models"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/repositories"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/utils"

	"golang.org/x/crypto/bcrypt"
)

type TeacherAuthService interface {
	Register(req *models.TeacherRegisterRequest) (*models.TeacherAuthResponse, error)
	Login(req *models.TeacherSigninRequest) (*models.TeacherAuthResponse, error)
	GetTeacherByID(teacherID int) (*models.Teacher, error)
}

type teacherAuthService struct {
	teacherRepo repositories.TeacherRepository
}

func NewTeacherAuthService(teacherRepo repositories.TeacherRepository) TeacherAuthService {
	return &teacherAuthService{teacherRepo: teacherRepo}
}

func (s *teacherAuthService) Register(req *models.TeacherRegisterRequest) (*models.TeacherAuthResponse, error) {
	// Check if teacher already exists
	existingTeacher, _ := s.teacherRepo.GetTeacherByEmail(req.Email)
	if existingTeacher != nil {
		return nil, errors.New("teacher already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create teacher
	teacher := &models.Teacher{
		Name:     req.Name,
		Email:    req.Email,
		PhNo:     req.PhNo,
		Password: string(hashedPassword),
	}

	err = s.teacherRepo.RegisterTeacher(teacher)
	if err != nil {
		return nil, err
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(teacher.TeacherId, "teacher")
	if err != nil {
		return nil, err
	}

	// Remove password from response
	teacher.Password = ""

	return &models.TeacherAuthResponse{
		Token:   token,
		Teacher: *teacher,
	}, nil
}

func (s *teacherAuthService) Login(req *models.TeacherSigninRequest) (*models.TeacherAuthResponse, error) {
	// Get teacher by email
	teacher, err := s.teacherRepo.GetTeacherByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Check password
	err = bcrypt.CompareHashAndPassword([]byte(teacher.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(teacher.TeacherId, "teacher")
	if err != nil {
		return nil, err
	}

	// Remove password from response
	teacher.Password = ""

	return &models.TeacherAuthResponse{
		Token:   token,
		Teacher: *teacher,
	}, nil
}

// 🔥 Get teacher by ID for /me endpoint
func (s *teacherAuthService) GetTeacherByID(teacherID int) (*models.Teacher, error) {
	teacher, err := s.teacherRepo.GetTeacherByID(teacherID)
	if err != nil {
		return nil, err
	}

	// Remove password from response
	teacher.Password = ""
	return teacher, nil
}