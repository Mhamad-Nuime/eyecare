document.addEventListener("DOMContentLoaded", function () {
    loadAppointments();
  });
  
  function loadAppointments() {
    fetch("http://localhost:5018/api/admin/appointments")
      .then((response) => response.json())
      .then((data) => {
        const appointmentTable = document.getElementById("appointment-list");
        appointmentTable.innerHTML = "";
        data.forEach((appointment) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${appointment.patientName}</td>
            <td>${appointment.doctorName}</td>
            <td>${appointment.date}</td>
            <td>${appointment.time}</td>
            <td>${appointment.status}</td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="editAppointment('${appointment.id}')">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteAppointment('${appointment.id}')">Delete</button>
            </td>`;
          appointmentTable.appendChild(row);
        });
      })
      .catch((error) => console.error("Error loading appointments:", error));
  }
  
  function deleteAppointment(appointmentId) {
    fetch(`http://localhost:5018/api/admin/appointments/${appointmentId}`, {
      method: "DELETE",
    })
      .then(() => loadAppointments())
      .catch((error) => console.error("Error deleting appointment:", error));
  }
  
  function editAppointment(appointmentId) {
    // Implement edit functionality
  }

  