document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    fetchPatientAppointments(token);
    fetchPatientFeedback(token);

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = '../login.html';
    });
});

function fetchPatientAppointments(token) {
    fetch('http://localhost:7276/api/patient/appointments', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const appointmentList = document.getElementById('appointmentList');
        appointmentList.innerHTML = '';

        data.forEach(appointment => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Appointment with Dr. ${appointment.doctorName} on ${appointment.date}`;

            appointmentList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching appointments:', error);
    });
}

function fetchPatientFeedback(token) {
    fetch('http://localhost:7276/api/patient/feedback', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const feedbackList = document.getElementById('feedbackList');
        feedbackList.innerHTML = '';

        data.forEach(feedback => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Feedback to Dr. ${feedback.doctorName}: ${feedback.content}`;

            feedbackList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching feedback:', error);
    });
}
