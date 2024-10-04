document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetchAppointments(token);

    document.getElementById('appointmentDate').addEventListener('input', function() {
        fetchAppointments(token);
    });

    document.getElementById('doctorFilter').addEventListener('input', function() {
        fetchAppointments(token);
    });

    document.getElementById('patientFilter').addEventListener('input', function() {
        fetchAppointments(token);
    });

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

function fetchAppointments(token) {
    const filterDate = document.getElementById('appointmentDate').value;
    const filterDoctor = document.getElementById('doctorFilter').value;
    const filterPatient = document.getElementById('patientFilter').value;

    fetch(`${window.currentEnv.apiUrl}/api/admin/appointments?date=${filterDate}&doctor=${filterDoctor}&patient=${filterPatient}`, {
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
            listItem.textContent = `Appointment with ${appointment.patientName} and Dr. ${appointment.doctorName} on ${appointment.date}`;

            const rescheduleBtn = document.createElement('button');
            rescheduleBtn.className = 'btn btn-sm btn-info float-right ml-2';
            rescheduleBtn.textContent = 'Reschedule';
            rescheduleBtn.addEventListener('click', () => rescheduleAppointment(appointment.id));

            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-sm btn-danger float-right';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.addEventListener('click', () => cancelAppointment(token, appointment.id));

            listItem.appendChild(rescheduleBtn);
            listItem.appendChild(cancelBtn);
            appointmentList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching appointments:', error);
    });
}

function rescheduleAppointment(appointmentId) {
    $('#rescheduleModal').modal('show');

    document.getElementById('rescheduleForm').onsubmit = function(event) {
        event.preventDefault();
        const newDate = document.getElementById('newAppointmentDate').value;
        const token = localStorage.getItem('token');

        fetch(`${window.currentEnv.apiUrl}/api/admin/appointments/${appointmentId}/reschedule`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ newDate })
        })
        .then(response => {
            if (response.ok) {
                $('#rescheduleModal').modal('hide');
                fetchAppointments(token);
                alert('Appointment rescheduled successfully!');
            } else {
                alert('Failed to reschedule appointment.');
            }
        })
        .catch(error => {
            console.error('Error rescheduling appointment:', error);
        });
    };
}

function cancelAppointment(token, appointmentId) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/appointments/${appointmentId}/cancel`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            fetchAppointments(token);
            alert('Appointment canceled successfully!');
        } else {
            alert('Failed to cancel appointment.');
        }
    })
    .catch(error => {
        console.error('Error canceling appointment:', error);
    });
}
