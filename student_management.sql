CREATE DATABASE IF NOT EXISTS student_database;
USE student_database;
CREATE TABLE branch (
    branch_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department_head VARCHAR(100)
);
CREATE TABLE subject (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    branch_id INT,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
);
CREATE TABLE subject_cluster (
    subject_cluster_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
CREATE TABLE subject_cluster_map (
    subject_cluster_id INT,
    subject_id INT,
    PRIMARY KEY (subject_cluster_id, subject_id),
    FOREIGN KEY (subject_cluster_id) REFERENCES subject_cluster(subject_cluster_id),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id)
);

CREATE TABLE semester (
    semester_id INT PRIMARY KEY AUTO_INCREMENT,
    sem_num INT,
    branch_id INT,
    subject_cluster_id INT,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
    FOREIGN KEY (subject_cluster_id) REFERENCES subject_cluster(subject_cluster_id)
);
CREATE TABLE batch (
    batch_id INT PRIMARY KEY AUTO_INCREMENT,
    branch_id INT,
    started YEAR,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
);
CREATE TABLE class (
    class_id INT PRIMARY KEY AUTO_INCREMENT,
    semester_id INT,
    section VARCHAR(1),
    FOREIGN KEY (semester_id) REFERENCES semester(semester_id),
    UNIQUE (semester_id, section)
);
CREATE TABLE student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    branch_id INT,
    batch_id INT,
    class_id INT,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    ph_no VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
    FOREIGN KEY (batch_id) REFERENCES batch(batch_id),
    FOREIGN KEY (class_id) REFERENCES class(class_id)
);
CREATE TABLE student_class (
    student_id INT,
    class_id INT,
    sem_num INT,
    PRIMARY KEY (student_id,class_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (class_id) REFERENCES class(class_id)
)
CREATE TABLE teacher (
    teacher_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    ph_no VARCHAR(20),
    password VARCHAR(255) NOT NULL
);
CREATE TABLE subject_assigned (
    teacher_id INT,
    subject_id INT,
    PRIMARY KEY (teacher_id,subject_id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id)
); 
CREATE TABLE allotted_class (
    teacher_id INT,
    class_id INT,
    PRIMARY KEY (teacher_id,class_id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id),
    FOREIGN KEY (class_id) REFERENCES class(class_id)
); 
CREATE TABLE attendance_resource (
    attendance_res_id INT PRIMARY KEY AUTO_INCREMENT,
    batch_id INT,
    class_id INT,
    subject_id INT,
    attendance_date DATE NOT NULL,
    hour TINYINT,
    marked_at DATETIME DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (batch_id) REFERENCES batch(batch_id),
    FOREIGN KEY (class_id) REFERENCES class(class_id),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id),
    UNIQUE KEY uq_session (class_id,batch_id, subject_id, attendance_date, hour)
);
CREATE TABLE attendance_info (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    attendance_res_id INT,
    student_id INT,
    status TINYINT(1) NOT NULL,
    FOREIGN KEY (attendance_res_id) REFERENCES attendance_resource(attendance_res_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    UNIQUE KEY uq_attendance (attendance_res_id, student_id)
);
CREATE TABLE teacher_password (
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (email,password),
    FOREIGN KEY (email) REFERENCES teacher(email)
);
CREATE TABLE student_password (
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (email,password),
    FOREIGN KEY (email) REFERENCES student(email)
);
CREATE TABLE result (
    result_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_id INT,
    student_id INT,
    marks_obtained FLOAT,
    total_marks FLOAT,
    exam_name VARCHAR(100),
    exam_date DATE,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE
);
