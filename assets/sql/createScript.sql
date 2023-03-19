DROP DATABASE IF EXISTS company;

CREATE DATABASE company;

USE	company;

CREATE TABLE department(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department INT NOT NULL,
    FOREIGN KEY (department)
		REFERENCES department(id)
);

CREATE TABLE employee(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL, -- ON DELETE
    manager_id INT NULL,
    FOREIGN KEY (role_id)
		REFERENCES role(id),
	FOREIGN KEY (manager_id)
		REFERENCES employee(id)
);

