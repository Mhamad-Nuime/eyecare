document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    // Load departments dynamically
    loadDepartments();

    // Load working hours dynamically
    loadWorkingHours();

    // Populate appointment form with backend data
    populateAppointmentForm();

    // Check if the user is logged in
    if (token) {
        customizeForLoggedInUser(token);
    } else {
        customizeForGuestUser();
    }

    // Handle appointment booking
    document.getElementById('appointmentForm').addEventListener('submit', function (event) {
        event.preventDefault();
        bookAppointment();
    });
});

function loadDepartments() {
    fetch(`${window.currentEnv.apiUrl}/api/departments`)
        .then(response => response.json())
        .then(data => {
            const departmentSelect = document.getElementById('departmentSelect');
            const departmentList = document.getElementById('footer_department_items');
            data.forEach(department => {
                const option = document.createElement('option');
                option.value = department.id;
                option.textContent = department.name;
                departmentSelect.appendChild(option);

                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `department.html?id=${department.id}`;
                link.textContent = department.name;
                listItem.appendChild(link);
                departmentList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading departments:', error));
}

function loadWorkingHours() {
    fetch(`${window.currentEnv.apiUrl}/api/clinic/hours`)
        .then(response => response.json())
        .then(data => {
            const scheduleList = document.getElementById('feature_2_schedule');
            data.forEach(schedule => {
                const listItem = document.createElement('li');
                listItem.classList.add('d-flex', 'justify-content-between');
                listItem.textContent = `${schedule.day} : ${schedule.startTime} - ${schedule.endTime}`;
                scheduleList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading working hours:', error));
}

function populateAppointmentForm() {
    fetch(`${window.currentEnv.apiUrl}/api/doctors`)
        .then(response => response.json())
        .then(data => {
            const doctorSelect = document.getElementById('doctorSelect');
            data.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = doctor.name;
                doctorSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading doctors:', error));
}

function bookAppointment() {
    const appointmentData = {
        departmentId: document.getElementById('departmentSelect').value,
        doctorId: document.getElementById('doctorSelect').value,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        patientName: document.getElementById('patientName').value,
        patientPhone: document.getElementById('patientPhone').value,
        message: document.getElementById('message').value
    };

    fetch(`${window.currentEnv.apiUrl}/api/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(appointmentData)
    })
        .then(response => response.json())
        .then(data => {
            alert('Appointment booked successfully!');
        })
        .catch(error => console.error('Error booking appointment:', error));
}

function customizeForLoggedInUser(token) {
    // Change navigation items or load user-specific content
}

function customizeForGuestUser() {
    // Hide or disable certain features for non-logged-in users
}
