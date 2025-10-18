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

	classID,err1 := s.studRepo.GetClassID(req.Semester,req.BranchId,req.Section)

	if err1 != nil {
		return nil, err1
	}

	// Create user
	stud := &models.Student{
		Name: req.Name,
		Email: req.Email,
		RollNo: req.RollNo,
		PhNo: req.PhNo,
		ClassID: classID,
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
	// Get student by email
	stud, err := s.studRepo.GetStudentByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Check password
	err = bcrypt.CompareHashAndPassword([]byte(stud.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid credentials")
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
// 🔥 NEW: Get student by ID for /me endpoint
func (s *authService) GetStudentByID(studID int) (*models.Student, error) {
	stud, err := s.studRepo.GetStudentByID(studID)
	if err != nil {
		return nil, err
	}
	
	// Remove password from response
	stud.Password = ""
	return stud, nil
}