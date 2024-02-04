// Helper function to make fetch requests
const fetchData = async (url, method, data, successCallback) => {
    try {
        const button = document.activeElement;
        button.innerHTML = '<span class="spinner"></span>Adding...';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if needed
          // 'Authorization': 'Bearer YOUR_JWT_TOKEN'
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      button.innerHTML = 'Submitted!';

      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  
  // Add Student
  const addStudent = () => {
    const regNumber = document.getElementById('regNumber').value;
    const studentName = document.getElementById('studentName').value;
  
    fetchData('/api/add-student', 'POST', { regNumber, studentName }, () => {
        // Clear the form after a 2-second delay
        setTimeout(() => {
          document.getElementById('regNumber').value = '';
          document.getElementById('studentName').value = '';
        }, 2000);
      })
      .then(data => {
        console.log(data);
        // Optionally update the UI or display a success message
      });
  };
  
  // Add Lecturer
  const addLecturer = () => {
    const lecturerName = document.getElementById('lecturerName').value;
  
    fetchData('/api/add-lecturer', 'POST', { lecturerName })
      .then(data => {
        console.log(data);
        // Optionally update the UI or display a success message
      });
  };
  
  // Add Course
  const addCourse = () => {
    const courseCode = document.getElementById('courseCode').value;
    const courseName = document.getElementById('courseName').value;
  
    fetchData('/api/add-course', 'POST', { courseCode, courseName })
      .then(data => {
        console.log(data);
        // Optionally update the UI or display a success message
      });
  };
  
  // Populate Courses dropdown and update Students dropdown based on selected course
  document.getElementById('selectCourse').addEventListener('change', () => {
    const selectedCourseCode = document.getElementById('selectCourse').value;
  
    fetchData(`/api/course-students/${selectedCourseCode}`, 'GET')
      .then(data => {
        const selectStudentDropdown = document.getElementById('selectStudent');
        // Clear previous options
        selectStudentDropdown.innerHTML = '';
  
        // Populate Students dropdown
        data.forEach(student => {
          const option = document.createElement('option');
          option.value = student.student_id;
          option.textContent = student.student_name;
          selectStudentDropdown.appendChild(option);
        });
      });
  });
  
  // Mark Attendance
  const markAttendance = () => {
    const studentId = document.getElementById('selectStudent').value;
    const courseCode = document.getElementById('selectCourse').value;
    const lecturerId = 1; // Replace with actual lecturer ID or fetch it dynamically
    const status = document.getElementById('attendanceStatus').value;
  
    fetchData('/api/mark-attendance', 'POST', { studentId, courseCode, lecturerId, status })
      .then(data => {
        console.log(data);
        // Optionally update the UI or display a success message
      });
  };
  