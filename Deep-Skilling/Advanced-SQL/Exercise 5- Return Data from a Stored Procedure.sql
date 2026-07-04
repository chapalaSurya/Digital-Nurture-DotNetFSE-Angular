CREATE DATABASE IF NOT EXISTS EmployeeManagement;
USE EmployeeManagement;
CREATE TABLE Departments (
    DepartmentID INT PRIMARY KEY,
    DepartmentName VARCHAR(100)
);
CREATE TABLE Employees (
    EmployeeID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    DepartmentID INT,
    Salary DECIMAL(10,2),
    JoinDate DATE,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);
INSERT INTO Departments (DepartmentID, DepartmentName) VALUES
(1, 'HR'),
(2, 'Finance'),
(3, 'IT'),
(4, 'Marketing');
INSERT INTO Employees (EmployeeID, FirstName, LastName, DepartmentID, Salary, JoinDate) VALUES
(1, 'John', 'Doe', 1, 5000.00, '2020-01-15'),
(2, 'Jane', 'Smith', 2, 6000.00, '2019-03-22'),
(3, 'Michael', 'Johnson', 3, 7000.00, '2018-07-30'),
(4, 'Emily', 'Davis', 4, 5500.00, '2021-11-05');
DELIMITER //
CREATE PROCEDURE sp_GetEmployeeCountByDepartment(
    IN p_DepartmentID INT,
    OUT p_EmployeeCount INT
)
BEGIN
    SELECT COUNT(*) INTO p_EmployeeCount
    FROM Employees
    WHERE DepartmentID = p_DepartmentID;
END //
DELIMITER ;
CALL sp_GetEmployeeCountByDepartment(3, @total);
SELECT @total AS TotalEmployeesInDepartment;
