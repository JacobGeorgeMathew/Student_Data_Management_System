
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

-- Class Table
CREATE TABLE class (
    class_id INT PRIMARY KEY AUTO_INCREMENT,
    branch_id INT,
    name VARCHAR(100) NOT NULL,
    semester INT,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
);

-- Student Table
CREATE TABLE student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    branch_id INT,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    class_id INT,
    email VARCHAR(100) UNIQUE,
    ph_no VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
    FOREIGN KEY (class_id) REFERENCES class(class_id)
);

-- Teacher Table
CREATE TABLE teacher (
    teacher_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL
);

-- Subject Table
CREATE TABLE subject (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    teacher_id INT,
    branch_id INT,
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id),
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
);

-- Attendance Table
CREATE TABLE attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL
);

-- Attendance Details Table
CREATE TABLE attendance_detail (
    attendance_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    attendance_id INT,
    subject_id INT,
    hour TINYINT,
    student_id INT,
    FOREIGN KEY (attendance_id) REFERENCES attendance(attendance_id),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id)
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
