// /js/doctor/appointment-management.js

$(document).ready(function () {
    loadAppointments();

    // Event listener for adding an appointment
    $("#addAppointment").on("click", function() {
        // Trigger modal or form to add an appointment
        alert("Feature to add an appointment is not yet implemented.");
    });
});

function loadAppointments() {
    $.ajax({
        url: `${window.currentEnv.apiUrl}/api/appointment`, // Adjust the API URL based on your structure
        method: 'GET',
        success: function(appointments) {
            if (appointments && Array.isArray(appointments)) {
                renderAppointments(appointments);
            } else {
                console.error("Invalid appointments format:", appointments);
            }
        },
        error: function(error) {
            console.error("Error fetching appointments:", error);
        }
    });
}

function renderAppointments(appointments) {
    const appointmentList = $('#appointment-list');
    appointmentList.empty(); // Clear the list before appending new items

    appointments.forEach(function(appointment) {
        const appointmentHTML = `
            <tr>
                <td>${appointment.id}</td>
                <td>${appointment.patient.name}</td>
                <td>${new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                <td>${appointment.appointmentTime}</td>
                <td>${appointment.status}</td>
                <td>
                    <button class="btn btn-warning" onclick="editAppointment('${appointment.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteAppointment('${appointment.id}')">Delete</button>
                </td>
            </tr>
        `;
        appointmentList.append(appointmentHTML);
    });
}

function editAppointment(appointmentId) {
    alert(`Feature to edit appointment with ID ${appointmentId} is not yet implemented.`);
}

function deleteAppointment(appointmentId) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        $.ajax({
            url: `${window.currentEnv.apiUrl}/api/appointments/${appointmentId}`, // Adjust the API URL based on your structure
            method: 'DELETE',
            success: function() {
                alert('Appointment deleted successfully!');
                loadAppointments(); // Refresh the appointment list
            },
            error: function(error) {
                console.error("Error deleting appointment:", error);
            }
        });
    }
}
