package services

import (
	"errors"

	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/models"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/repositories"
	"github.com/JacobGeorgeMathew/Student_Data_Management_System/internals/utils"

	"golang.org/x/crypto/bcrypt"
)

type StudAuthService interface {
	Register(req *models.StudRegisterRequest) (*models.StudAuthResponse, error)
	Login(req *models.StudSigninRequest) (*models.StudAuthResponse, error)
	GetStudentByID(userID int) (*models.Student, error) 
}

type authService struct {
	studRepo repositories.StudentRepository
}

func NewAuthService(studRepo repositories.StudentRepository) StudAuthService {
	return &authService{studRepo: studRepo}
}

func (s *authService) Register(req *models.StudRegisterRequest) (*models.StudAuthResponse, error) {
	// Check if user already exists
	existingUser, _ := s.studRepo.GetStudentByEmail(req.Email)
	if existingUser != nil {
		return nil, errors.New("user already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user
	stud := &models.Student{
		Name: req.Name,
		Email: req.Email,
		RollNo: req.RollNo,
		PhNo: req.PhNo,
		BatchId: req.BatchId,
		BranchId: req.BranchId,
		Password: string(hashedPassword),
	}

	err = s.studRepo.RegisterStudent(stud)
	if err != nil {
		return nil, err
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(stud.StudentId,"student")
	if err != nil {
		return nil, err
	}

	// Remove password from response
	stud.Password = ""

	return &models.StudAuthResponse{
		Token: token,
		Stud:  *stud,
	}, nil
}

func (s *authService) Login(req *models.StudSigninRequest) (*models.StudAuthResponse, error) {
	return  nil, nil
}

func (s *authService) GetStudentByID(userID int) (*models.Student, error) {
	return  nil, nil
}