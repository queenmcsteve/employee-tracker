USE employee_db;

INSERT INTO department (name) VALUES ('Research & Design'), ('Production'), ('Sales & Marketing'), ('Finance & Accounting');

INSERT INTO role (title, salary, department_id) 
VALUES 
('R&D Lead', 50000, 1), 
('R&D Associate', 40000, 1),
('Production Lead', 50000, 2),
('Production Associate', 40000, 2),
('M&S Lead', 50000, 3),
('M&S Associate', 40000, 3),
('F&A Lead', 50000, 4),
('F&A Associate', 50000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES
('Rob', 'McEleheny', 1, null),
('Charlie', 'Kelly', 2, 1),
('Deandra', 'Reynolds', 3, null),
('Dennis', 'Reynolds', 4, 3),
('Earn', 'Marks', 5, null),
('Alfred', 'Miles', 6, 5),
('Frank', 'Reynolds', 7, null),
('Darius', 'Epps', 8, 7);