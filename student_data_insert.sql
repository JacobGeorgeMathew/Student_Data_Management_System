INSERT INTO branch (name, department_head) VALUES
('Computer Science', 'Dr. A Sharma'),
('Electronics', 'Dr. B Mehta'),
('Mechanical', 'Dr. C Reddy'),
('Civil', 'Dr. D Patel'),
('Information Technology', 'Dr. E Gupta');
INSERT INTO subject (name, code, branch_id) VALUES
('Data Structures', 'CS101', 1),
('Operating Systems', 'CS102', 1),
('Digital Circuits', 'EC201', 2),
('Thermodynamics', 'ME301', 3),
('Database Systems', 'IT401', 5);
INSERT INTO semester (sem_num, branch_id, subject_id) VALUES
(1, 1, 1),
(2, 1, 2),
(1, 2, 3),
(3, 3, 4),
(5, 5, 5);
INSERT INTO batch (branch_id, name, started, semester_id) VALUES
(1, 'CS2021A', 2021, 1),
(1, 'CS2022B', 2022, 2),
(2, 'EC2021A', 2021, 3),
(3, 'ME2020A', 2020, 4),
(5, 'IT2021A', 2021, 5);
INSERT INTO student (name, branch_id, batch_id, roll_number, email, ph_no, password) VALUES
('Rahul Verma', 1, 1, 'CS21A001', 'rahul.verma@example.com', '9876543210', 'pass123'),
('Anjali Singh', 1, 2, 'CS22B002', 'anjali.singh@example.com', '9876543211', 'pass123'),
('Rohit Mehta', 2, 3, 'EC21A003', 'rohit.mehta@example.com', '9876543212', 'pass123'),
('Sneha Reddy', 3, 4, 'ME20A004', 'sneha.reddy@example.com', '9876543213', 'pass123'),
('Karan Gupta', 5, 5, 'IT21A005', 'karan.gupta@example.com', '9876543214', 'pass123');
INSERT INTO teacher (name, email, ph_no, password) VALUES
('Prof. Manish Kumar', 'manish.kumar@example.com', '9000000001', 'teach123'),
('Prof. Neha Rao', 'neha.rao@example.com', '9000000002', 'teach123'),
('Prof. Sunil Shah', 'sunil.shah@example.com', '9000000003', 'teach123'),
('Prof. Kavita Joshi', 'kavita.joshi@example.com', '9000000004', 'teach123'),
('Prof. Ajay Nair', 'ajay.nair@example.com', '9000000005', 'teach123');
INSERT INTO subject_cluster (teacher_id, subject_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(5, 5);
INSERT INTO allotted_batch (teacher_id, batch_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(5, 5);
INSERT INTO attendance_resource (batch_id, subject_id, attendance_date, hour) VALUES
(1, 1, '2025-09-01', 1),
(2, 2, '2025-09-01', 2),
(3, 3, '2025-09-02', 1),
(4, 4, '2025-09-03', 3),
(5, 5, '2025-09-04', 2);
INSERT INTO attendance_info (attendance_res_id, student_id, status) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 0),
(4, 4, 1),
(5, 5, 1);
INSERT INTO result (subject_id, student_id, marks_obtained, total_marks, exam_name, exam_date) VALUES
(1, 1, 85, 100, 'Midterm', '2025-08-15'),
(2, 2, 78, 100, 'Midterm', '2025-08-15'),
(3, 3, 90, 100, 'Final', '2025-08-20'),
(4, 4, 65, 100, 'Final', '2025-08-20'),
(5, 5, 88, 100, 'Midterm', '2025-08-25');
