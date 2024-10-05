document.addEventListener("DOMContentLoaded", function () {
  loadAppointments();
});

function loadAppointments() {
  fetch(`${window.currentConfig.apiUrl}/api/admin/appointments`)
      .then((response) => {
          if (!response.ok) {
              throw new Error("Network response was not ok: " + response.statusText);
          }
          return response.json();
      })
      .then((data) => {
          console.log("Fetched appointments data:", data); // Log the entire data object

          const appointmentTable = document.getElementById("appointment-list");
          appointmentTable.innerHTML = "";

          // Check if data and $values exist
          if (data && Array.isArray(data.$values)) {
              data.$values.forEach((appointment) => {
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
          } else {
              console.error("Expected an array of appointments, but got:", data);
              appointmentTable.innerHTML = "<tr><td colspan='6'>No appointments found.</td></tr>";
          }
      })
      .catch((error) => console.error("Error loading appointments:", error));
}

function deleteAppointment(appointmentId) {
  fetch(`${window.currentConfig.apiUrl}/api/admin/appointments/${appointmentId}`, {
      method: "DELETE",
  })
      .then(() => loadAppointments())
      .catch((error) => console.error("Error deleting appointment:", error));
}

function editAppointment(appointmentId) {
  // Implement edit functionality
}
