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
          departmentSelect.innerHTML += `<option value="${department}">${department.name}</option>`;
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
        doctorSelect.innerHTML += `<option value="${doctor}">${doctor.name}</option>`;
      });
    })
    .catch(error => console.error('Error fetching doctors:', error));
}

function bookAppointment() {

  const department = document.getElementById('departmentSelect').value;
  const doctor = document.getElementById('doctorSelect').value;
  const appointmentDate = document.getElementById('appointmentDate').value;
  const appointmentTime = document.getElementById('appointmentTime').value;
  const patientName = document.getElementById('patientName').value;
  const patientPhone = document.getElementById('patientPhone').value;
  const message = document.getElementById('message').value;

  
  const appointment = {
    "appointmentDto": {
      "appointmentDate": appointmentDate,
    "appointmentTime": appointmentTime,
      "status": "Scheduled",
      "doctor": {
        "id": doctor.id,
        "name": doctor.name,
        "specialization": "Specialization",
        "bio": "Doctor bio",
        "phone": "Doctor phone number",
        "profileImageUrl": "http://example.com/doctor.jpg",
        "clinics": [
          {
            "clinicId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "name": "Clinic Name",
            "address": "Clinic Address",
            "departments": [
              {
                "departmentId": department.id,
                "name": department.name,
                "phone": "Department Phone",
                "departmentImageUrl": "http://example.com/department.jpg",
                "doctors": [
                  "d2799011-ca75-464c-91eb-c2027bd115b2"
                ]
              }
            ]
          }
        ]
      },
      "patient": {
        "id": "55ebd6e7-93c7-489b-83f3-df90c1bbed7a",
        "name": patientName,
        "email": "patient@example.com",
        "medicalProfile": {
          "medicalProfileId": "medical-profile-id-string",
          "medicalHistory": "Medical History",
          "medications": "Current Medications",
          "allergies": "Known Allergies",
          "bloodType": "Blood Type",
          "attachmentUrl": "http://example.com/attachment.jpg",
          "patient": "55ebd6e7-93c7-489b-83f3-df90c1bbed7a"
        }
      }
    }}

  fetch(`${window.currentEnv.apiUrl}/api/appointment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointment)
  })
  .then(response => response.json())
  .then(data => {
    alert(data.Message || 'Appointment booked successfully!');
  })
  .catch(error => console.error('Error booking appointment:', error));
}
