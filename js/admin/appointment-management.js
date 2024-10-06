document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem('userToken');
    if (!token) {
      window.location.href = '../../login.html';
    }
    loadAppointments();
    document.getElementById("appoinment-patient-filter").addEventListener("input" , filter("patient"));
    document.getElementById("appoinment-doctor-filter").addEventListener("input" , filter("doctor"));
  });

  function loadAppointments(query = undefined) {
    let url;
    if(query){
      url = `${window.currentConfig.apiUrl}/api/admin/appointments?${query}`
    } else {
      url =  `${window.currentConfig.apiUrl}/api/admin/appointments`
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const appointmentTable = document.getElementById("appointment-list");
        appointmentTable.innerHTML = "";
        data.$values.forEach((appointment) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${appointment?.patient?.name || "N/A"}</td>
            <td>${appointment?.doctor?.name || "N/A"}</td>
            <td>${appointment?.appointmentDate || "N/A"}</td>
            <td>${appointment?.appointmentTime || "N/A"}</td>
            <td>${appointment?.status || "N/A"}</td>
            <td id="actions">
              <button class="btn btn-sm btn-primary" onclick="editAppointment('${appointment.appointmentId}')">Reschedule</button>
              <button class="btn btn-sm btn-danger" onclick="deleteAppointment('${appointment.appointmentId}')">Delete</button>
            </td>`;
          appointmentTable.appendChild(row);
        });
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
    const editForm = document.getElementById("appoinment-form");
    const appointmentForm = document.getElementById("appointmentForm");
    const rescheduleField = document.getElementById("reschedule");
    const errorMessageField = document.getElementById("error-message");
    const exitButton = document.getElementById("close-form").onclick = () => editForm.style.display = "none";
    editForm.style.display = "block";
    console.log(rescheduleField.value);
    appointmentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      fetch(`${window.currentConfig.apiUrl}/api/admin/appointments/${appointmentId}/reschedule?`,
        {
          method : "PUT",
          headers : {
            "Content-Type" : "Application/json"
          },
          body : JSON.stringify({
            "newDate": rescheduleField.value,
          })
        }
      )
    .then(() => editForm.style.display = "none")
    .catch(() => errorMessageField.innerHTML = "Error Occured Retry");
    })
    
  }
  function filter(type){
    if(type == "doctor"){
      return (e) => {
        const query = e.target.value;
        loadAppointments(`doctor=${query}`);
      }
    }
    else if(type == "patient"){
      return (e) => {
        const query = e.target.value;
        loadAppointments(`patient=${query}`);
      }
    }
  }
  
