import connection from "../models/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const createAdmin = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the username already exists
      const [existingAdmin] = await connection.execute(
        'SELECT * FROM admins WHERE username = ?',
        [username]
      );
  
      if (existingAdmin.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the admin into the database
      await connection.execute(
        'INSERT INTO admins (username, password) VALUES (?, ?)',
        [username, hashedPassword]
      );
  
      // Generate JWT token
      const token = jwt.sign(
        { username: username }, // Include username in the token payload
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );
  
      res.json({ message: 'Admin created successfully', token });
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ message: 'Failed to create admin' });
    }
  };