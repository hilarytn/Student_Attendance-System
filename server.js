import express from 'express';
import mysql from 'mysql2';
import ip from'ip';
import dotenv from'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { addStudent, getStudents, getStudentsByCourse } from './controllers/StudentController.js';
import { addLecturer, getLecturers } from './controllers/LecturerController.js';
import { addCourse, getCourses } from './controllers/CourseController.js';
import { markAttendance } from './controllers/AttendanceController.js';

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

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/api/add-student', addStudent);
app.post('/api/add-lecturer', addLecturer);
app.post('/api/add-course', addCourse);
app.get('/api/students', getStudents);
app.get('/api/courses', getCourses);
app.get('/api/lecturers', getLecturers);
app.get('/api/course-students/:courseCode', getStudentsByCourse);
app.post('/api/mark-attendance', markAttendance);

app.use((req, res) => {
    res.status(404).render('not-found');
  });


app.listen(PORT, HOST, (req, res) => {
    console.log(`Server running on ${HOST}:${PORT}`);
})
