-- Create a new database
CREATE DATABASE IF NOT EXISTS Student_Attendance_System;

-- Create a new user
CREATE USER 'salun'@'localhost' IDENTIFIED BY 'salun';

-- Grant privileges to the user on the database
GRANT ALL PRIVILEGES ON Student_Attendance_System.* TO 'salun'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;