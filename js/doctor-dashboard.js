document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html'; // Redirect to login if not authenticated
        return;
    }

    // Fetch Doctor Details and Appointments
    fetchDoctorDetails(token);
    fetchAppointments(token);
    fetchMessages(token);

    // Event Listeners for Profile Update
    document.getElementById('profileForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateProfile(token);
    });

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

function fetchDoctorDetails(token) {
    fetch(`${window.currentEnv.apiUrl}/api/doctor/details`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('doctorName').textContent = data.name;
        document.getElementById('doctorEmail').value = data.email;
        document.getElementById('specialization').value = data.specialization;
        document.getElementById('availability').value = data.availability;
    })
    .catch(error => {
        console.error('Error fetching doctor details:', error);
    });
}

function fetchAppointments(token) {
    fetch(`${window.currentEnv.apiUrl}/api/doctor/appointments`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const appointmentList = document.getElementById('appointmentList');
        appointmentList.innerHTML = ''; // Clear existing appointments

        data.forEach(appointment => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Appointment with ${appointment.patientName} on ${appointment.date}`;
            appointmentList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching appointments:', error);
    });
}

function fetchMessages(token) {
    fetch(`${window.currentEnv.apiUrl}/api/doctor/messages`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const messageList = document.getElementById('messageList');
        messageList.innerHTML = ''; // Clear existing messages

        data.forEach(message => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Message from ${message.patientName}: ${message.content}`;
            messageList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching messages:', error);
    });
}

function updateProfile(token) {
    const specialization = document.getElementById('specialization').value;
    const availability = document.getElementById('availability').value;

    fetch(`${window.currentEnv.apiUrl}/api/doctor/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ specialization, availability })
    })
    .then(response => {
        if (response.ok) {
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile.');
        }
    })
    .catch(error => {
        console.error('Error updating profile:', error);
    });
}
