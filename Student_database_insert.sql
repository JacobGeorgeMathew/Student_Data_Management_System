INSERT INTO branch (name, department_head)
VALUES
('Computer Science and Engineering', 'Dr. Anil Kumar'),
('Information Technology', 'Dr. Sneha Reddy'),
('Electronics and Communication Engineering', 'Dr. Rajesh Nair'),
('Mechanical Engineering', 'Dr. Meera Joshi'),
('Civil Engineering', 'Dr. Raghav Patel');
INSERT INTO subject (name, code, branch_id)
VALUES
('Data Structures', 'CSE101', 1),
('Algorithms', 'CSE102', 1),
('Database Systems', 'CSE103', 1),
('Operating Systems', 'CSE104', 1),
('Computer Networks', 'CSE105', 1),
('Machine Learning', 'CSE106', 1),
('Software Engineering', 'CSE107', 1),
('Artificial Intelligence', 'CSE108', 1);
INSERT INTO subject (name, code, branch_id)
VALUES
('Web Technologies', 'IT101', 2),
('Cloud Computing', 'IT102', 2),
('Network Security', 'IT103', 2),
('Database Management', 'IT104', 2),
('Operating Systems', 'IT105', 2),
('Data Analytics', 'IT106', 2),
('Software Testing', 'IT107', 2),
('Mobile App Development', 'IT108', 2);
INSERT INTO subject (name, code, branch_id)
VALUES
('Digital Electronics', 'ECE101', 3),
('Analog Circuits', 'ECE102', 3),
('Signals and Systems', 'ECE103', 3),
('Microprocessors', 'ECE104', 3),
('Communication Systems', 'ECE105', 3),
('VLSI Design', 'ECE106', 3),
('Embedded Systems', 'ECE107', 3),
('Antenna Theory', 'ECE108', 3);
INSERT INTO subject (name, code, branch_id)
VALUES
('Engineering Mechanics', 'ME101', 4),
('Thermodynamics', 'ME102', 4),
('Fluid Mechanics', 'ME103', 4),
('Machine Design', 'ME104', 4),
('Manufacturing Processes', 'ME105', 4),
('Heat Transfer', 'ME106', 4),
('Dynamics of Machines', 'ME107', 4),
('Automobile Engineering', 'ME108', 4);
INSERT INTO subject (name, code, branch_id)
VALUES
('Surveying', 'CE101', 5),
('Building Materials', 'CE102', 5),
('Structural Analysis', 'CE103', 5),
('Geotechnical Engineering', 'CE104', 5),
('Environmental Engineering', 'CE105', 5),
('Transportation Engineering', 'CE106', 5),
('Hydraulics', 'CE107', 5),
('Concrete Technology', 'CE108', 5);
INSERT INTO subject_cluster (name)
VALUES
('Core Subjects Cluster'),
('Advanced Subjects Cluster'),
('Laboratory Cluster'),
('Elective Cluster'),
('Foundation Cluster');
INSERT INTO subject_cluster_map (subject_cluster_id, subject_id)
VALUES
(1, 1), (1, 2), (1, 3), (2, 6), (2, 8),
(3, 10), (4, 15), (1, 20), (2, 25), (5, 30),
(3, 35), (4, 40);
INSERT INTO semester (sem_num, branch_id, subject_cluster_id)
SELECT sem_num, branch_id, (branch_id % 5) + 1
FROM (
    SELECT 1 AS sem_num UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
    SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8
) AS sems
CROSS JOIN (
    SELECT branch_id FROM branch
) AS branches;
INSERT INTO batch (branch_id, started)
VALUES
(1, 2020),
(2, 2020),
(3, 2021),
(4, 2021),
(5, 2022);
INSERT INTO class (semester_id, section)
SELECT semester_id, section
FROM semester
CROSS JOIN (
    SELECT 'A' AS section UNION ALL SELECT 'B' UNION ALL SELECT 'C' UNION ALL SELECT 'D' UNION ALL SELECT 'E'
) AS sections;
