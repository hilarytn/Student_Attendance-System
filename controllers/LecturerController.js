import connection from '../models/db.js';

export const addLecturer = (req, res) => {
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
}