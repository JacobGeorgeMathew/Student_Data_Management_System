
-- Student Data Management System Database Schema
-- SOURCE /path/to/student_management.sql;

CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

-- Branch Table
CREATE TABLE branch (
    branch_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department_head VARCHAR(100)
);

-- Subject Table
CREATE TABLE subject (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    branch_id INT,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
);

-- Semester Table
CREATE TABLE semester (
    semester_id INT PRIMARY KEY AUTO_INCREMENT,
    sem_num INT,
    branch_id INT,
    subject_id INT,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id)
);

-- Class Table
CREATE TABLE batch (
    batch_id INT PRIMARY KEY AUTO_INCREMENT,
    branch_id INT,
    name VARCHAR(100) NOT NULL,
    started YEAR,
    semester_id INT,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
    FOREIGN KEY (semester_id) REFERENCES semester(semester_id)
);

-- Student Table
CREATE TABLE student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    branch_id INT,
    batch_id INT,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    ph_no VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
    FOREIGN KEY (batch_id) REFERENCES batch(batch_id)
);

-- Teacher Table
CREATE TABLE teacher (
    teacher_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    ph_no VARCHAR(20),
    password VARCHAR(255) NOT NULL
);


CREATE TABLE subject_cluster (
    teacher_id INT,
    subject_id INT,
    PRIMARY KEY (teacher_id,subject_id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id)
); 

CREATE TABLE allotted_batch (
    teacher_id INT,
    batch_id INT,
    PRIMARY KEY (teacher_id,class_id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id),
    FOREIGN KEY (batch_id) REFERENCES batch(batch_id)
); 

-- Attendance Table
CREATE TABLE attendance_resource (
    attendance_res_id INT PRIMARY KEY AUTO_INCREMENT,
    batch_id INT,
    subject_id INT,
    attendance_date DATE NOT NULL,
    hour TINYINT,
    marked_at DATETIME DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (batch_id) REFERENCES batch(batch_id),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id),
    UNIQUE KEY uq_session (batch_id, subject_id, attendance_date, hour)
);

-- Attendance Details Table
CREATE TABLE attendance_info (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    attendance_res_id INT,
    student_id INT,
    status TINYINT(1) NOT NULL,
    FOREIGN KEY (attendance_res_id) REFERENCES attendance_resource(attendance_res_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    UNIQUE KEY uq_attendance (attendance_res_id, student_id)
);

-- Result Table
CREATE TABLE result (
    result_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_id INT,
    student_id INT,
    marks_obtained FLOAT,
    total_marks FLOAT,
    exam_name VARCHAR(100),
    exam_date DATE,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id)
);
