import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

//Create database connection
export const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Create admin tables if not exist
connection.query(`
  CREATE TABLE IF NOT EXISTS admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  );
`);

// Create student tables if not exist
connection.query(`
  CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    reg_number VARCHAR(255),
    student_name VARCHAR(255),
    password VARCHAR(255)
  );
`);

connection.query(`
  CREATE TABLE IF NOT EXISTS courses (
    course_code VARCHAR(255) PRIMARY KEY,
    course_name VARCHAR(255),
    lecturer_id INT,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(lecturer_id)
  );
`);

connection.query(`
  CREATE TABLE IF NOT EXISTS lecturers (
    lecturer_id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_name VARCHAR(255),
    password VARCHAR(255) NOT NULL
  );
`);

connection.query(`
  CREATE TABLE IF NOT EXISTS attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_code VARCHAR(255),
    lecturer_id INT,
    attendance_date DATE,
    status VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_code) REFERENCES courses(course_code),
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(lecturer_id)
  );
`);


export default connection;