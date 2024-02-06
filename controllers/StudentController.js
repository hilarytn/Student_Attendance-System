import connection from '../models/db';


const addStudent = async (req, res) => {
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
      if (regNumber.length === 0 || studentName.length === 0) {
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
}

module.exports = { addStudent };