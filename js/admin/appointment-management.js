// TODO : in line 35 : here we should place the edit endpoint call
// TODO : implement display appointments in getAppointment()
// TODO : ensure  delete appointment endpoint path
// TODP : use toaster with every endpoint

window.addEventListener("DOMContentLoaded", () => {
  //   const token = localStorage.getItem('userToken');
//     if (!token) {
//       window.location.href = '../../login.html';
//     }
  getAppointment();
  deleteModalConfig()
  modalConfig();
});

function modalConfig() {
  // Get modal element
  const editModal = document.getElementById("editModal");
  const saveBtn = document.getElementById("edit-save");

  // Pass the appointment id to modal when it's shown
  editModal.addEventListener("shown.bs.modal", (event) => {
    const btn = event.relatedTarget; // Button that triggered the modal
    const appointmentId = btn.getAttribute("data-id"); // Get data-id from button
    console.log("data-id", appointmentId);

    // Set the appointment id into the hidden field in the form
    const idField = document.getElementById("appointment-id");
    idField.value = appointmentId;
  });

  // Add click event listener to the save button (attach this only once)
  saveBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent any default form behavior

    // Fetch values when the save button is clicked
    editAppointment()


    // TODO: Call your API here with id and datetime
  });
}
function deleteModalConfig() {
  const deleteModal = document.getElementById("delete-appointment-modal");
  deleteModal.addEventListener("show.bs.modal", (event) => {
    const btn = event.relatedTarget; // Button that triggered the modal
    const userId = btn.getAttribute("data-id"); // Get data-id from button
    // Set the appointment id into the hidden field in the form
    const idField = document.getElementById("delete-appointment-id");
    idField.value = userId;
    console.log(userId)
  });
}

async function getAppointment() {
  const tbody = document.getElementById("appointment-list");
  const user = JSON.parse(localStorage.getItem("user"));
  fetch(`${window.currentConfig.apiUrl}/api/Appointment/patient/${user.id}`)
  .then(res => res.json())
  .then(async (res) => {
    tbody.innerHTML = "";
    res.$values.forEach( async (appointment) => {
      const res1 = await fetch(`${window.currentConfig.apiUrl}/api/User/${appointment.doctorId}`)
      const doctorData = await res1.json();
      const doctorName = doctorData.name;

      const res3 = await fetch(`${window.currentConfig.apiUrl}/api/User/${appointment.patientId}`)
      const patientData = await res3.json();
      const patientName = patientData.name;

      const res2 = await fetch(`${window.currentConfig.apiUrl}/api/clinics/${appointment.clinicId}`)
      const clinicData = await res2.json();
      const clinicName = clinicData.name;
      debugger;
      const appointmentDate = appointment.appointmentDate.split("T")[0]; // "2024-10-14"

      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${clinicName}</td>
      <td>${doctorName}</td>
      <td>${patientName}</td>
      <td>${appointmentDate}</td>
      <td>${appointment.startTime}</td>
      <td>${appointment.endTime}</td>
      <td class="d-flex gap-1"><button class="btn btn-danger" data-id='${appointment.appointmentId}' data-bs-toggle="modal" data-bs-target="#delete-appointment-modal">Delete</button></td>
      `;
      tbody.appendChild(row);
    });
    showToast("Appointment loaded successfully", true);
  });
}

function editAppointment(){
  const appointmentId = document.getElementById("appointment-id").value;
  const datetime = document.getElementById("appointment-datetime").value;

  // TODO : Edit API call
  fetch(`${window.currentConfig.apiUrl}/api/appointments/${appointmentId}`, {
    method: "PUT",
    body : { newDate : datetime}
})
    .then(() => loadAppointments())
    .catch((error) => console.error("Error deleting appointment:", error));
}


function deleteAppointment() {
  const appointmentId = document.getElementById("delete-appointment-id").value;
  debugger;
  fetch(`${window.currentConfig.apiUrl}/api/Appointment/${appointmentId}`, {
      method: "DELETE",
  })
      .then((res) => {
        showToast("Appointment deleted sucessfully", true)
        getAppointment();
      })
      .catch((error) =>{
        showToast("Fail to delete Appointment", false)
      });
  }
