// TODO : implement display appointments in getAppointment()
// TODO : ensure  delete appointment endpoint path
// TODO : lines 48,49 : make user to successfully get the user data from localStorage to get the id 
// TODO : Implement the logic of createAppointment()

window.addEventListener("DOMContentLoaded", () => {
  //   const token = localStorage.getItem('userToken');
//     if (!token) {
//       window.location.href = '../../login.html';
//     }
  getAppointment();
  deleteModalConfig();
});
function deleteModalConfig() {
  const deleteModal = document.getElementById("delete-appointment-modal");
  deleteModal.addEventListener("show.bs.modal", (event) => {
    const btn = event.relatedTarget; // Button that triggered the modal
    const userId = btn.getAttribute("data-id"); // Get data-id from button
    // Set the appointment id into the hidden field in the form
    const idField = document.getElementById("delete-appointment-id");
    idField.value = userId;
  });
}
function getAppointment() {
  const tbody = document.getElementById("appointment-list");
  res = [
    {
      id: 5,
      clinic: { name: "Damas" },
      doctor: { name: "moe" },
      patient: { name: "japer" },
      date: "2024/06/01",
      time: "12:02:02",
    },
  ];
  res.forEach((appointment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${appointment.clinic.name}</td>
    <td>${appointment.doctor.name}</td>
    <td>${appointment.date}</td>
    <td>${appointment.time}</td>
    <td class="d-flex gap-1"><button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-appointment-modal">Delete</button></td>
    `;
    tbody.appendChild(row);
  });

  // ...................... Ready to use
  // const user = localStorage.getItem("user")
  // const patientId = user.id;
  // fetch(`${window.currentConfig.apiUrl}/api/appointments?patientId=${patientId}`)
  // .then(res => res.json())
  // .then(res => {
  //   const tbody = document.getElementById("appointment-list");
  //     res.forEach((appointment) => {
  //   const row = document.createElement("tr");
  //   row.innerHTML = `
  //   <td>${appointment.clinic.name}</td>
  //   <td>${appointment.doctor.name}</td>
  //   <td>${appointment.date}</td>
  //   <td>${appointment.time}</td>
  //   <td class="d-flex gap-1"><button
  //     type="button"
  //     id="appoitmentId"
  //     class="btn btn-primary"
  //     data-id="${appointment.id}"
  //     data-bs-toggle="modal"
  //     data-bs-target="#editModal"
  //   >
  //     Reschedule
  //   </button><button class="btn btn-sm btn-danger" onclick="deleteAppointment('${appointment.id}')">Delete</button></td>
  //   `;
  //   tbody.appendChild(row);
  // });
  // })
  // .catch();
}
function createAppointment(){
  const user = JSON.parse(localStorage.getItem("user"));
  const data = {
    clinicId : document.getElementById("clinicSelect"),
    doctorId : document.getElementById("doctorSelect"),
    data : document.getElementById("appointment-booking"),
    patienName : user.name,
    patientPhone : document.getElementById("patientPhone"),
    message : document.getElementById("message"),
  
  }}

function deleteAppointment() {
  const id = document.getElementById("delete-appointment-id");
  fetch(`${window.currentConfig.apiUrl}/api/appointments/${id}`, {
      method: "DELETE",
  })
      .then(() => {
        showToast("Appointment deleted sucessfully", true)
        loadAppointments();
      })
      .catch((error) =>{
        showToast("Fail to delete Appointment", false)
      });
  }
