package insert

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"golang.org/x/crypto/bcrypt"

	_ "github.com/go-sql-driver/mysql"
)

func StudentDataInsert(db *sql.DB) {

	// Query to count number of rows
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM student").Scan(&count)
	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}

	// Number of dummy records
	fmt.Println(count)
	totalStudents := 10
	

	// Determine starting index by inspecting existing roll_number values to avoid duplicates
	// Assumes roll_number format "Rxxxx" where xxxx is a zero-padded integer
	var maxRollStr sql.NullString
	err = db.QueryRow("SELECT MAX(roll_number) FROM student").Scan(&maxRollStr)
	if err != nil {
		log.Fatalf("Failed to get max roll_number: %v", err)
	}

	startIndex := count + 1
	if maxRollStr.Valid && len(maxRollStr.String) > 1 {
		var maxNum int
		// strip leading non-digit prefix (e.g., 'R') and parse remainder
		_, err := fmt.Sscanf(maxRollStr.String, "R%04d", &maxNum)
		if err == nil {
			// start after the maximum existing number
			startIndex = maxNum + 1
		}
	}

	totalStudents = totalStudents + startIndex

	// Prepare insert statements
	stmtStudent, err := db.Prepare(`
		INSERT INTO student (name, branch_id, batch_id, class_id, roll_number, email, ph_no, password)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		log.Fatalf("Prepare student failed: %v", err)
	}
	defer stmtStudent.Close()

	stmtPwd, err := db.Prepare(`
		INSERT INTO student_password (email, password)
		VALUES (?, ?)
	`)
	if err != nil {
		log.Fatalf("Prepare student_password failed: %v", err)
	}
	defer stmtPwd.Close()

	// Random data generation
	gofakeit.Seed(0)

	batchID := 1
	classID := 10

	for i := startIndex; i <= totalStudents; i++ {

		name := gofakeit.Name()
		//branchID := (i % 5) + 1
		//branchID := gofakeit.Number(1, 5)
		branchID := 1
		// if i%5 == 0 {
		// 	batchID = (batchID % 5) + 1
		// }
		//batchID := gofakeit.Number(1, 5)
		//batchID := 2
		// if i%25 == 0 {
		// 	classID = (classID % 5) + 1
		// }
		//classID := gofakeit.Number(1, 200)
		//classID := 1
		rollNumber := fmt.Sprintf("R%04d", i)
		email := fmt.Sprintf("example%d@gmail.com", i)
		phone := gofakeit.Phone()

		// Generate random plain password
		//plainPassword := gofakeit.Password(true, true, true, true, false, 10)
		plainPassword := "password"

		// Hash password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(plainPassword), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("Hash error for %s: %v", email, err)
			continue
		}

		// Insert into student
		_, err = stmtStudent.Exec(name, branchID, batchID, classID, rollNumber, email, phone, string(hashedPassword))
		if err != nil {
			log.Printf("Insert student failed for %s: %v", email, err)
			continue
		}

		// Insert into student_password (email + plain password)
		_, err = stmtPwd.Exec(email, plainPassword)
		if err != nil {
			log.Printf("Insert student_password failed for %s: %v", email, err)
			continue
		}

		//fmt.Printf("Inserted student: %-25s | Email: %-25s | Password: %s\n", name, email, plainPassword)
		fmt.Printf("Inserted %d student \n", i)
	}

	fmt.Println("✅ Dummy student data inserted successfully.")
}

func TeacherDataInsert(db *sql.DB) {
	// Get counts for class and subject tables
	var classCount, subjectCount int
	if err := db.QueryRow("SELECT COUNT(*) FROM class").Scan(&classCount); err != nil {
		log.Fatalf("Failed to count classes: %v", err)
	}
	if err := db.QueryRow("SELECT COUNT(*) FROM subject").Scan(&subjectCount); err != nil {
		log.Fatalf("Failed to count subjects: %v", err)
	}

	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM student").Scan(&count)
	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}

	// Number of dummy teachers
	totalTeachers := 50
	totalTeachers = totalTeachers + count

	// Prepare insert statements
	stmtTeacher, err := db.Prepare(`
		INSERT INTO teacher (name, email, ph_no, password)
		VALUES (?, ?, ?, ?)
	`)
	if err != nil {
		log.Fatalf("Prepare teacher failed: %v", err)
	}
	defer stmtTeacher.Close()

	stmtPwd, err := db.Prepare(`
		INSERT INTO teacher_password (email, password)
		VALUES (?, ?)
	`)
	if err != nil {
		log.Fatalf("Prepare teacher_password failed: %v", err)
	}
	defer stmtPwd.Close()

	stmtAssign, err := db.Prepare(`
		INSERT INTO subject_assigned (teacher_id, subject_id)
		VALUES (?, ?)
	`)
	if err != nil {
		log.Fatalf("Prepare subject_assigned failed: %v", err)
	}
	defer stmtAssign.Close()

	stmtAllot, err := db.Prepare(`
		INSERT INTO allotted_class (teacher_id, class_id)
		VALUES (?, ?)
	`)
	if err != nil {
		log.Fatalf("Prepare allotted_class failed: %v", err)
	}
	defer stmtAllot.Close()

	// Random data generation
	gofakeit.Seed(0)

	for i := 1; i <= totalTeachers; i++ {
		name := gofakeit.Name()
		email := fmt.Sprintf("teacher%d@gmail.com", i)
		phone := gofakeit.Phone()
		//plainPassword := gofakeit.Password(true, true, true, true, false, 10)
		plainPassword := "password"

		// Hash password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(plainPassword), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("Hash error for %s: %v", email, err)
			continue
		}

		// Insert teacher record
		res, err := stmtTeacher.Exec(name, email, phone, string(hashedPassword))
		if err != nil {
			log.Printf("Insert teacher failed for %s: %v", email, err)
			continue
		}

		teacherID, _ := res.LastInsertId()

		// Insert into teacher_password (plain password for admin use)
		_, err = stmtPwd.Exec(email, plainPassword)
		if err != nil {
			log.Printf("Insert teacher_password failed for %s: %v", email, err)
			continue
		}

		// Assign random subjects (1–3 per teacher)
		subjectsToAssign := gofakeit.Number(1, 3)
		for j := 0; j < subjectsToAssign; j++ {
			subjectID := gofakeit.Number(1, subjectCount)
			_, err = stmtAssign.Exec(teacherID, subjectID)
			if err != nil {
				log.Printf("Assign subject failed for %s: %v", email, err)
			}
		}

		// Allot random classes (1–2 per teacher)
		classesToAllot := gofakeit.Number(1, 2)
		for j := 0; j < classesToAllot; j++ {
			classID := gofakeit.Number(1, classCount)
			_, err = stmtAllot.Exec(teacherID, classID)
			if err != nil {
				log.Printf("Allot class failed for %s: %v", email, err)
			}
		}

		// fmt.Printf("Inserted teacher: %-25s | Email: %-25s | Password: %s\n", name, email, plainPassword)
		fmt.Printf("Inserted %d teacher: ", i)
	}

	fmt.Println("✅ Dummy teacher data inserted successfully.")
}

func AttendanceDataInsert(db *sql.DB) {
	// Get counts
	var classCount, subjectCount, studentCount int
	if err := db.QueryRow("SELECT COUNT(*) FROM class").Scan(&classCount); err != nil {
		log.Fatalf("Failed to count classes: %v", err)
	}
	if err := db.QueryRow("SELECT COUNT(*) FROM subject").Scan(&subjectCount); err != nil {
		log.Fatalf("Failed to count subjects: %v", err)
	}
	if err := db.QueryRow("SELECT COUNT(*) FROM student").Scan(&studentCount); err != nil {
		log.Fatalf("Failed to count students: %v", err)
	}

	// Prepare insert statements
	stmtRes, err := db.Prepare(`
		INSERT INTO attendance_resource (batch_id, class_id, subject_id, attendance_date, hour)
		VALUES (?, ?, ?, ?, ?)
	`)
	if err != nil {
		log.Fatalf("Prepare attendance_resource failed: %v", err)
	}
	defer stmtRes.Close()

	stmtInfo, err := db.Prepare(`
		INSERT INTO attendance_info (attendance_res_id, student_id, status)
		VALUES (?, ?, ?)
	`)
	if err != nil {
		log.Fatalf("Prepare attendance_info failed: %v", err)
	}
	defer stmtInfo.Close()

	gofakeit.Seed(0)

	// Number of attendance sessions
	totalSessions := 100
	classID := 10

	for i := 1; i <= totalSessions; i++ {

		//batchID := gofakeit.Number(1,5)
		//batchID := (i % 5) + 1
		batchID := 1
		//classID := gofakeit.Number(1, classCount)
		// if i%5 == 0 {
		// 	classID = (classID % 200) + 1
		// }
		//classID = 167
		subjectID := gofakeit.Number(1, subjectCount)
		//subjectID := 1
		hour := gofakeit.Number(1, 6)
		//hour := 1
		//date := gofakeit.DateRange(time.Now().AddDate(0, 0, -30), time.Now()).Format("2006-01-02")

		start := time.Date(2025, 9, 1, 0, 0, 0, 0, time.Local)
		end := time.Date(2025, 9, 30, 23, 59, 59, 0, time.Local)
		date := gofakeit.DateRange(start, end).Format("2006-01-02")

		// Insert attendance session
		res, err := stmtRes.Exec(batchID, classID, subjectID, date, hour)
		if err != nil {
			log.Printf("Insert attendance_resource failed: %v", err)
			continue
		}

		attendanceResID, _ := res.LastInsertId()

		// Retrieve students belonging to that class
		rows, err := db.Query("SELECT student_id FROM student WHERE class_id = ? and batch_id = ?", classID, batchID)
		if err != nil {
			log.Printf("Failed to fetch students for class %d: %v", classID, err)
			continue
		}

		for rows.Next() {
			var studentID int
			if err := rows.Scan(&studentID); err != nil {
				log.Printf("Scan student failed: %v", err)
				continue
			}

			// Randomly decide attendance (80% present, 20% absent)
			status := 1
			if gofakeit.Number(1, 100) > 80 {
				status = 0
			}

			_, err = stmtInfo.Exec(attendanceResID, studentID, status)
			if err != nil {
				log.Printf("Insert attendance_info failed for student %d: %v", studentID, err)
			}
		}
		rows.Close()

		fmt.Printf("Inserted attendance session %d | Class: %d | Subject: %d | Date: %s | Hour: %d\n",
			i, classID, subjectID, date, hour)
	}

	fmt.Println("✅ Dummy attendance data inserted successfully.")
}
