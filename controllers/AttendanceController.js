import connection from "../models/db.js";

export const markAttendance = (req, res) => {
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
}