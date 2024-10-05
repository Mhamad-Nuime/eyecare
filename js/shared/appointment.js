document.addEventListener('DOMContentLoaded', function() {
  fetchDepartments();
  document.getElementById('departmentSelect').addEventListener('change', fetchDoctors);

  document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const isUserLoggedIn = checkUserLoggedIn();

    if (!isUserLoggedIn) {
      alert("You must be logged in to book an appointment.");
      window.location.href = "../login.html"; // Replace with your actual login page URL
    } else {
      bookAppointment();
    }
  });
});

function checkUserLoggedIn() {
  const token = localStorage.getItem('userToken');
  if (!token) {
    return false; // No token, user is not logged in
  }

  try {
    const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Extract payload (second part of the token)

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (tokenPayload.exp && tokenPayload.exp < currentTime) {
      console.log('Token expired');
      return false;
    }

    return true; // Token is valid and not expired
  } catch (error) {
    console.error('Error decoding token:', error);
    return false; // Token is invalid or corrupted
  }
}

function fetchDepartments() {
  fetch(`${window.currentEnv.apiUrl}/api/department`) // Adjust the URL to your actual API endpoint
    .then(response => response.json())
    .then(data => {
      console.log('Fetched Departments:', data); // Log the data structure
      const departmentSelect = document.getElementById('departmentSelect');
      departmentSelect.innerHTML = '<option value="">Choose Department</option>';
      
      const departments = data.$values;

      if (Array.isArray(departments)) {
        departments.forEach(department => {
          departmentSelect.innerHTML += `<option value="${department.departmentId}">${department.name}</option>`;
        });
      } else {
        console.error('Expected $values array, but got:', data);
        alert('Failed to load departments. Please try again later.');
      }
    })
    .catch(error => console.error('Error fetching departments:', error));
}

function fetchDoctors() {
  const departmentId = document.getElementById('departmentSelect').value;
  if (!departmentId) return;

  fetch(`${window.currentEnv.apiUrl}/api/doctorprofile/getalldoctorprofiles`) // Adjust URL to your actual API
    .then(response => response.json())
    .then(data => {
      const doctorSelect = document.getElementById('doctorSelect');
      doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
      data.$values.forEach(doctor => {
        doctorSelect.innerHTML += `<option value="${doctor.id}">${doctor.name}</option>`;
      });
    })
    .catch(error => console.error('Error fetching doctors:', error));
}

function bookAppointment() {
  const departmentId = document.getElementById('departmentSelect').value;
  const doctorId = document.getElementById('doctorSelect').value;
  const date = document.getElementById('appointmentDate').value;
  const time = document.getElementById('appointmentTime').value;
  const patientName = document.getElementById('patientName').value;
  const patientPhone = document.getElementById('patientPhone').value;
  const message = document.getElementById('message').value;

  fetch(`${window.currentEnv.apiUrl}/api/admin/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      departmentId,
      doctorId,
      date,
      time,
      patientName,
      patientPhone,
      message
    })
  })
  .then(response => response.json())
  .then(data => {
    alert(data.Message || 'Appointment booked successfully!');
  })
  .catch(error => console.error('Error booking appointment:', error));
}
