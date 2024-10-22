// TODO : in line 35 : here we should place the edit endpoint call
// TODO : implement display appointments in getAppointment()
// TODO : ensure  delete appointment endpoint path
// TODO : implement the logic of createAppointment()

window.addEventListener("DOMContentLoaded", () => {
    //   const token = localStorage.getItem('userToken');
  //     if (!token) {
  //       window.location.href = '../../login.html';
  //     }
    getAppointment();
    modalConfig();
    deleteModalConfig();
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
      <td>${appointment.patient.name}</td>
      <td>${appointment.date}</td>
      <td>${appointment.time}</td>
      <td class="d-flex gap-1"><button
        type="button"
        id="appoitmentId"
        class="btn btn-primary"
        data-id="${appointment.id}"
        data-bs-toggle="modal"
        data-bs-target="#editModal"
      >
        Reschedule
      </button><button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-appointment-modal" data-id="${appointment.id}">Delete</button></td>
      `;
      tbody.appendChild(row);
    });
  
    // ...................... Ready to use
    // const user = localStorage.getItem("user");
    // const doctorId = user.id;
    // fetch(`${window.currentConfig.apiUrl}/api/appointments?doctorId=${doctorId}`)
    // .then(res => res.json())
    // .then(res => {
    //   const tbody = document.getElementById("appointment-list");
    //     res.forEach((appointment) => {
    //   const row = document.createElement("tr");
    //   row.innerHTML = `
    //   <td>${appointment.clinic.name}</td>
    //   <td>${appointment.patient.name}</td>
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
  
  function createAppointment(){
    const user = JSON.parse(localStorage.getItem("user"));
    const data = {
      clinicId : document.getElementById("clinicSelect"),
      doctorId : user.id,
      data : document.getElementById("appointment-booking"),
      patienName : document.getElementById("patientName"),
      patientPhone : document.getElementById("patientPhone"),
      message : document.getElementById("message"),
    }
  }