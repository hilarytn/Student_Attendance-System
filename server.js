const express = require('express');
const mysql = require('mysql2');
const ip = require('ip');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app =  express();

const HOST = ip.address();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/assets', express.static(path.join(__dirname, 'assets')));


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

app.post('/api/add-student', (req, res) => {
    const { regNumber, studentName } = req.body;

    // Check if regNumber already exists
    const checkQuery = `SELECT * FROM students WHERE reg_number = '${regNumber}'`;

    connection.query(checkQuery, (checkError, checkResults) => {
      if (checkError) {
        throw checkError;
      }
  
      // If regNumber already exists, return a message
      if (checkResults.length > 0) {
        return res.status(400).json({ message: 'Registration number already exists' });
      }
      if (regNumber || studentName.length === 0) {
        return res.status(400).json({ message: 'Registration Number or Student Name cannot be blank' })
      } 
      // If regNumber does not exist, insert the new student
      const insertQuery = `INSERT INTO students (reg_number, student_name) VALUES ('${regNumber}', '${studentName}')`;
  
      connection.query(insertQuery, (insertError, insertResults) => {
        if (insertError) {
          throw insertError;
        }
  
        res.json({ message: 'Student added successfully' });
      });
    });
});

app.post('/api/add-lecturer', (req, res) => {
    const { lecturerName } = req.body;
  
    // Check if lecturerName already exists
    const checkQuery = `SELECT * FROM lecturers WHERE lecturer_name = '${lecturerName}'`;
  
    connection.query(checkQuery, (checkError, checkResults) => {
      if (checkError) {
        throw checkError;
      }
  
      // If lecturerName already exists, return a message
      if (checkResults.length > 0) {
        return res.status(400).json({ message: 'Lecturer name already exists' });
      }
  
      // If lecturerName does not exist, insert the new lecturer
      const insertQuery = `INSERT INTO lecturers (lecturer_name) VALUES ('${lecturerName}')`;
  
      connection.query(insertQuery, (insertError, insertResults) => {
        if (insertError) {
          throw insertError;
        }
  
        res.json({ message: 'Lecturer added successfully' });
      });
    });
});
  
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
