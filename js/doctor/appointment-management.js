document.addEventListener("DOMContentLoaded", () => {
    loadAppointments();
})

function loadAppointments() {
    const values = [
        {
            id : "2",
            name : "moe",
            appointmentDate : "2024/10/01",
            appointmentTime : "09:30",
            status : "active"
        },
    ]
    const appointmentList = document.getElementById('appointment-list');
    values.forEach( item => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${appointment.id}</td>
        <td>${appointment.name}</td>
        <td>${appointment.appointmentDate}</td>
        <td>${appointment.appointmentTime}</td>
        <td>${appointment.status}</td>
        <td>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-whatever='${appointment.id}'>Edit</button>
            <button class="btn btn-danger" onclick="deleteAppointment('${appointment.id}')">Delete</button>
        </td>
        `;
        appointmentList.appendChild(row);
    })
    // fetch()
    // .then(res => res.json())
    // .then(
    //     res => {
    //         const appointmentList = document.getElementById('#appointment-list');
    //         res.values.forEach( item => {
    //             const row = document.createElement("row");
    //             row.innerHTML = `
    //             <td>${appointment.id}</td>
    //             <td>${appointment.patient.name}</td>
    //             <td>${appointment.appointmentDate}</td>
    //             <td>${appointment.appointmentTime}</td>
    //             <td>${appointment.status}</td>
    //             <td>
    //                 <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-whatever='${appointment.id}'>Edit</button>
    //                 <button class="btn btn-danger" onclick="deleteAppointment('${appointment.id}')">Delete</button>
    //             </td>
    //             `;
    //         })
    //     }
    // )
    // .catch()
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
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Edit</button>
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
