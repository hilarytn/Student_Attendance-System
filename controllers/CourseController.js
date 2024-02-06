import connection from "../models/db.js";

export const addCourse = (req, res) => {
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
  }

  export const getCourses = (req, res) => {
    // Retrieve course data from the database
    connection.query('SELECT * FROM courses', (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  }