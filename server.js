import express from 'express';
import mysql from 'mysql2';
import ip from'ip';
import dotenv from'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { addStudent } from './controllers/StudentController.js';
import { addLecturer } from './controllers/LecturerController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app =  express();

const HOST = ip.address();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.use('/assets', express.static(join(__dirname, 'assets')));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
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

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/api/add-student', addStudent);
app.post('/api/add-lecturer', addLecturer);
  
app.post('/api/add-course', (req, res) => {
    const { courseCode, courseName } = req.body;
  
    // Check if courseCode already exists
    const checkQuery = `SELECT * FROM courses WHERE course_code = '${courseCode}'`;
  
    connection.query(checkQuery, (checkError, checkResults) => {
      if (checkError) {
        throw checkError;
      }
  
      // If courseCode already exists, return a message
      if (checkResults.length > 0) {
        return res.status(400).json({ message: 'Course code already exists' });
      }
  
      // If courseCode does not exist, insert the new course
      const insertQuery = `INSERT INTO courses (course_code, course_name) VALUES ('${courseCode}', '${courseName}')`;
  
      connection.query(insertQuery, (insertError, insertResults) => {
        if (insertError) {
          throw insertError;
        }
  
        res.json({ message: 'Course added successfully' });
      });
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

app.use((req, res) => {
    res.status(404).render('not-found');
  });


app.listen(PORT, HOST, (req, res) => {
    console.log(`Server running on ${HOST}:${PORT}`);
})
