const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const ip = require('ip');

const app =  express();

const HOST = ip.address();
const PORT = process.env.PORT || 4000;


app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// Create tables if not exist
connection.query(`
  CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    reg_number VARCHAR(255),
    student_name VARCHAR(255)
  );
`);

connection.query(`
  CREATE TABLE IF NOT EXISTS courses (
    course_code VARCHAR(255) PRIMARY KEY,
    course_name VARCHAR(255)
  );
`);

connection.query(`
  CREATE TABLE IF NOT EXISTS lecturers (
    lecturer_id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_name VARCHAR(255)
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

app.post('/api/add-student', (req, res) => {
  const { regNumber, studentName } = req.body;
  const query = `INSERT INTO students (reg_number, student_name) VALUES ('${regNumber}', '${studentName}')`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json({ message: 'Student added successfully' });
  });
});

app.post('/api/add-lecturer', (req, res) => {
  const { lecturerName } = req.body;
  const query = `INSERT INTO lecturers (lecturer_name) VALUES ('${lecturerName}')`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json({ message: 'Lecturer added successfully' });
  });
});

app.post('/api/add-course', (req, res) => {
  const { courseCode, courseName } = req.body;
  const query = `INSERT INTO courses (course_code, course_name) VALUES ('${courseCode}', '${courseName}')`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json({ message: 'Course added successfully' });
  });
});

app.get('/api/students', (req, res) => {
  // Retrieve student data from the database
  connection.query('SELECT * FROM students', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get('/api/courses', (req, res) => {
  // Retrieve course data from the database
  connection.query('SELECT * FROM courses', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get('/api/lecturers', (req, res) => {
  // Retrieve lecturer data from the database
  connection.query('SELECT * FROM lecturers', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get('/api/course-students/:courseCode', (req, res) => {
  const { courseCode } = req.params;
  // Retrieve students for a specific course
  const query = `
    SELECT students.student_id, students.student_name
    FROM students
    JOIN courses ON courses.course_code = '${courseCode}'
  `;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.post('/api/mark-attendance', (req, res) => {
  const { studentId, courseCode, lecturerId, status } = req.body;
  // Update attendance in the database
  const query = `
    INSERT INTO attendance (student_id, course_code, lecturer_id, attendance_date, status)
    VALUES (${studentId}, '${courseCode}', ${lecturerId}, CURDATE(), '${status}')
  `;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json({ message: 'Attendance marked successfully' });
  });
});


app.listen(PORT, HOST, (req, res) => {
    console.log(`Server running on ${HOST}:${PORT}`);
})