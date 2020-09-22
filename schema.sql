DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;


CREATE TABLE department (
    id INT AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    PRIMARY KEY (id)
)

CREATE TABLE role (
    id INT AUTO_INCREMENT,
    title VARCHAR(45) NOT NULL,
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id)
)

CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(45),
    last_name VARCHAR(45),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id)
)