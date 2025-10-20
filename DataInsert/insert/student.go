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

func StudentDataInsert(db *sql.DB, n int) {
    // n = number of students per class per batch

    // Get all batches and classes with their semester details
    rows, err := db.Query(`
        SELECT c.class_id, s.sem_num, s.branch_id, b.batch_id
        FROM class c
        JOIN semester s ON c.semester_id = s.semester_id
        JOIN batch b ON b.branch_id = s.branch_id
        ORDER BY s.branch_id, b.batch_id, s.sem_num, c.section
    `)
    if err != nil {
        log.Fatalf("Failed to fetch class info: %v", err)
    }
    defer rows.Close()

    type ClassInfo struct {
        ClassID   int
        SemNum    int
        BranchID  int
        BatchID   int
    }

    var classes []ClassInfo
    for rows.Next() {
        var ci ClassInfo
        if err := rows.Scan(&ci.ClassID, &ci.SemNum, &ci.BranchID, &ci.BatchID); err != nil {
            log.Fatal(err)
        }
        classes = append(classes, ci)
    }

    // Prepare insert statements
    stmtStudent, err := db.Prepare(`
        INSERT INTO student (name, branch_id, batch_id, class_id, roll_number, email, ph_no, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    if err != nil {
        log.Fatalf("Prepare student failed: %v", err)
    }
    defer stmtStudent.Close()

    stmtStudentClass, err := db.Prepare(`
        INSERT INTO student_class (student_id, class_id, sem_num)
        VALUES (?, ?, ?)
    `)
    if err != nil {
        log.Fatalf("Prepare student_class failed: %v", err)
    }
    defer stmtStudentClass.Close()

    // Random data
    gofakeit.Seed(0)

    // Get last roll number
    var maxRollStr sql.NullString
    _ = db.QueryRow("SELECT MAX(roll_number) FROM student").Scan(&maxRollStr)

    startIndex := 1
    if maxRollStr.Valid && len(maxRollStr.String) > 1 {
        var maxNum int
        if _, err := fmt.Sscanf(maxRollStr.String, "R%04d", &maxNum); err == nil {
            startIndex = maxNum + 1
        }
    }

    rollIndex := startIndex

    // Loop through all batches/classes
    for _, ci := range classes {
        for i := 0; i < n; i++ {
            name := gofakeit.Name()
            rollNumber := fmt.Sprintf("R%04d", rollIndex)
            email := fmt.Sprintf("student%d@gmail.com", rollIndex)
            phone := gofakeit.Phone()
            plainPassword := "password"

            hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(plainPassword), bcrypt.DefaultCost)

            res, err := stmtStudent.Exec(name, ci.BranchID, ci.BatchID, ci.ClassID, rollNumber, email, phone, string(hashedPassword))
            if err != nil {
                log.Printf("Insert student failed for %s: %v", email, err)
                continue
            }

            studentID, _ := res.LastInsertId()

            // Insert into student_class for all previous semesters
            prevClasses, err := db.Query(`
                SELECT c.class_id, s.sem_num
                FROM class c
                JOIN semester s ON c.semester_id = s.semester_id
                WHERE s.branch_id = ? AND s.sem_num < ?
            `, ci.BranchID, ci.SemNum)
            if err != nil {
                log.Printf("Fetch previous classes failed: %v", err)
                continue
            }

            for prevClasses.Next() {
                var pcID, semNum int
                prevClasses.Scan(&pcID, &semNum)
                _, err := stmtStudentClass.Exec(studentID, pcID, semNum)
                if err != nil {
                    log.Printf("Insert into student_class failed: %v", err)
                }
            }
            prevClasses.Close()

            fmt.Printf("Inserted student %s for class %d (Sem %d, Batch %d)\n", rollNumber, ci.ClassID, ci.SemNum, ci.BatchID)
            rollIndex++
        }
    }

    fmt.Println("✅ Successfully inserted students for all batches and classes.")
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

func AttendanceDataInsert(db *sql.DB, n int) {
    gofakeit.Seed(0)

    // Fetch all class-semester relationships
    classRows, err := db.Query(`
        SELECT c.class_id, c.semester_id, s.subject_cluster_id
        FROM class c
        JOIN semester s ON c.semester_id = s.semester_id
        ORDER BY c.class_id
    `)
    if err != nil {
        log.Fatalf("Failed to fetch class-semester info: %v", err)
    }
    defer classRows.Close()

    type ClassInfo struct {
        ClassID           int
        SemesterID        int
        SubjectClusterID  int
    }

    var classes []ClassInfo
    for classRows.Next() {
        var ci ClassInfo
        if err := classRows.Scan(&ci.ClassID, &ci.SemesterID, &ci.SubjectClusterID); err != nil {
            log.Fatalf("Scan failed: %v", err)
        }
        classes = append(classes, ci)
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

    // Loop through every class
    for _, ci := range classes {
        // Get batch_id from one of the students in that class (since same branch)
        var batchID int
        err := db.QueryRow(`
            SELECT DISTINCT batch_id
            FROM student
            WHERE class_id = ?
            LIMIT 1
        `, ci.ClassID).Scan(&batchID)
        if err != nil {
            log.Printf("No batch found for class %d: %v", ci.ClassID, err)
            continue
        }

        // Get all subject IDs linked to that class’s subject cluster
        subjRows, err := db.Query(`
            SELECT subject_id
            FROM subject_cluster_map
            WHERE subject_cluster_id = ?
        `, ci.SubjectClusterID)
        if err != nil {
            log.Printf("Failed to fetch subjects for cluster %d: %v", ci.SubjectClusterID, err)
            continue
        }

        var subjectIDs []int
        for subjRows.Next() {
            var sid int
            subjRows.Scan(&sid)
            subjectIDs = append(subjectIDs, sid)
        }
        subjRows.Close()

        if len(subjectIDs) == 0 {
            log.Printf("No subjects found for cluster %d (class %d)", ci.SubjectClusterID, ci.ClassID)
            continue
        }

        // Get all students who are or were in this class
        studRows, err := db.Query(`
            SELECT DISTINCT student_id
            FROM student_class
            WHERE class_id = ?
        `, ci.ClassID)
        if err != nil {
            log.Printf("Failed to fetch students for class %d: %v", ci.ClassID, err)
            continue
        }

        var studentIDs []int
        for studRows.Next() {
            var sid int
            studRows.Scan(&sid)
            studentIDs = append(studentIDs, sid)
        }
        studRows.Close()

        if len(studentIDs) == 0 {
            log.Printf("No students found for class %d", ci.ClassID)
            continue
        }

        // Generate n attendance sessions per subject
        for _, subjectID := range subjectIDs {
            for i := 0; i < n; i++ {
                hour := gofakeit.Number(1, 6)
                start := time.Date(2025, 8, 1, 0, 0, 0, 0, time.Local)
                end := time.Date(2025, 9, 30, 23, 59, 59, 0, time.Local)
                date := gofakeit.DateRange(start, end).Format("2006-01-02")

                res, err := stmtRes.Exec(batchID, ci.ClassID, subjectID, date, hour)
                if err != nil {
                    log.Printf("Insert attendance_resource failed (class %d, subject %d): %v", ci.ClassID, subjectID, err)
                    continue
                }

                attendanceResID, _ := res.LastInsertId()

                // Add attendance entries for each student
                for _, studentID := range studentIDs {
                    status := 1
                    if gofakeit.Number(1, 100) > 80 {
                        status = 0
                    }

                    _, err = stmtInfo.Exec(attendanceResID, studentID, status)
                    if err != nil {
                        log.Printf("Insert attendance_info failed (student %d): %v", studentID, err)
                    }
                }

                fmt.Printf("✅ Inserted session for Class %d | Subject %d | Students %d | Date: %s | Hour: %d\n",
                    ci.ClassID, subjectID, len(studentIDs), date, hour)
            }
        }
    }

    fmt.Println("🎯 Attendance data inserted for all classes and subjects successfully.")
}

