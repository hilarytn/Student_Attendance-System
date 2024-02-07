# Student_Attendance-System

CREATE TABLE IF NOT EXISTS admins (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

<div class="form">
      <h2>Mark Attendance</h2>
      <form id="markAttendanceForm">
        <label for="selectCourse">Select Course:</label>
        <select id="selectCourse" name="selectCourse" required>
          <!-- Populate this dropdown dynamically with courses from the server -->
        </select>

        <label for="selectStudent">Select Student:</label>
        <select id="selectStudent" name="selectStudent" required>
          <!-- Populate this dropdown dynamically with students based on the selected course -->
        </select>

        <label for="attendanceStatus">Attendance Status:</label>
        <select id="attendanceStatus" name="attendanceStatus" required>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="present">Excused</option>
        </select>

        <button id="add-course-button" type="button" onclick="markAttendance()">Mark Attendance</button>
      </form>
    </div>