$.ajax({
    url: `${window.currentEnv.apiUrl}/api/appointment`, // Adjust this URL based on your API structure
    method: 'GET',
    success: function(appointments) {
        if (appointments && Array.isArray(appointments.$values)) {
            renderAppointments(appointments.$values);
        } else {
            console.error("Invalid appointments format:", appointments);
        }
    },
    error: function(error) {
        console.error("Error fetching appointments:", error);
    }
});

  
    function renderAppointments(appointments) {
        appointments.forEach(function(appointment) {
            const appointmentHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Appointment with ${appointment.patient.name}</h5>
                        <p class="card-text">
                            Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}<br>
                            Time: ${appointment.appointmentTime}<br>
                            Status: ${appointment.status}<br>
                            Doctor: ${appointment.doctor.name} (${appointment.doctor.specialization})<br>
                            Clinic: ${appointment.doctor.clinics[0].name}, ${appointment.doctor.clinics[0].address}
                        </p>
                    </div>
                </div>
            `;
            $('#appointment-list').append(appointmentHTML);  // Ensure #appointment-list is the container in your HTML
        });
    }
    
  