USE	company;

INSERT INTO department (name) VALUES 
('Sales'),
('Marketing'),
('Human Resources'),
('Finance'),
('Software Development');

INSERT INTO role (title, salary, department) VALUES 
('Sales Manager', 75000, 1),
('Sales Representative', 50000, 1),
('Marketing Manager', 80000, 2),
('Marketing Coordinator', 45000, 2),
('HR Manager', 90000, 3),
('HR Coordinator', 50000, 3),
('Finance Manager', 100000, 4),
('Accountant', 60000, 4),
('Software Development Manager', 120000, 5),
('Senior Software Engineer', 100000, 5),
('Software Engineer', 80000, 5),
('Junior Software Engineer', 60000, 5),
('Quality Assurance Engineer', 70000, 5),
('Technical Writer', 55000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Doe', 2, 1),
('Michael', 'Smith', 3, NULL),
('Emily', 'Johnson', 4, 3),
('David', 'Lee', 5, NULL),
('Samantha', 'Williams', 6, 5),
('Robert', 'Brown', 7, NULL),
('Olivia', 'Davis', 8, 7),
('Adam', 'Taylor', 9, NULL),
('Alice', 'Wilson', 10, 9),
('Blake', 'Jones', 11, 9),
('Benjamin', 'Miller', 12, 9),
('Caroline', 'Anderson', 13, 9),
('Derek', 'Parker', 14, 9);
