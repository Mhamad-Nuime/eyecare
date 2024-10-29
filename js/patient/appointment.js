// TODO : implement display appointments in getAppointment()
// TODO : ensure  delete appointment endpoint path
// TODO : lines 48,49 : make user to successfully get the user data from localStorage to get the id 
// TODO : Implement the logic of createAppointment()

window.addEventListener("DOMContentLoaded", () => {
  //   const token = localStorage.getItem('userToken');
//     if (!token) {
//       window.location.href = '../../login.html';
//     }
  addAppointmentConfig()
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

      const res2 = await fetch(`${window.currentConfig.apiUrl}/api/clinics/${appointment.clinicId}`)
      const clinicData = await res2.json();
      const clinicName = clinicData.name;
      debugger;
      const appointmentDate = appointment.appointmentDate.split("T")[0]; // "2024-10-14"

      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${clinicName}</td>
      <td>${doctorName}</td>
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

  function addAppointmentConfig(){
    const addModal = document.getElementById("add-appointment-modal");
    const iconCloseBtn = document.getElementById("close-add-appointment-icon-button");
    iconCloseBtn.addEventListener("click", (event) => {initSetupAddAppointmentModal()})
    const closeBtn = document.getElementById("close-add-appointment-button");
    closeBtn.addEventListener("click", (event) => {initSetupAddAppointmentModal()})
    loadAllClinics()
    addModal.addEventListener("show.bs.modal", (event) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const idField = document.getElementById("add-appointment-id");
      idField.value = user.id;
    })
  }
    //create appointment
  function loadAllClinics(){
    fetch(`${window.currentConfig.apiUrl}/api/clinics`)
    .then(response => response.json())
    .then(data => {
        const clinicSelect = document.getElementById("clinicSelect");
        clinicSelect.innerHTML = `<option value="" disabled selected hidden>choose</option>`;
          data.$values.forEach( (clinic) => {
            const option = document.createElement("option");
            option.value = clinic.clinicId;
            option.textContent = clinic.name;
            clinicSelect.appendChild(option);
          });
          clinicSelect.addEventListener("change", (event) => {
            const doctorSelect = document.getElementById("doctorSelect");
            doctorSelect.disabled = false;
            const clinicSelect = document.getElementById("clinicSelect");
            loadDoctorsByClinicId(clinicSelect.value);
          })
          showToast("Clinics loaded successfull", true)
    })
    .catch(error => console.error("Error loading clinics:", error));
  }

  function loadDoctorsByClinicId(id){
    fetch(`${window.currentConfig.apiUrl}/api/clinics/${id}/doctors`)
                    .then(res => res.json())
                    .then(res => {
                         const doctorSelect = document.getElementById("doctorSelect");
                         doctorSelect.innerHTML = `<option value="" disabled selected hidden>choose</option>`;
                         if(res.$values.length > 0 ){
                           for(let doctor of res.$values){
                              const option = document.createElement("option");
                              option.value = doctor.id;
                              option.textContent = doctor.name;
                              doctorSelect.appendChild(option);
                            }
                            doctorSelect.addEventListener("change", (event) => {
                              const doctorSelect = document.getElementById("doctorSelect");
                              loadAvailabilities(id, doctorSelect.value);
                            });
                          } else {
                            const option = document.createElement("option");
                            option.value = "";
                            option.textContent = "no doctors assigned to this clinic";
                            doctorSelect.appendChild(option);
                            showToast("choose another clinic because there's no doctor available in selected clinic", false);
                        }

                    })
                    .catch(err => {
                        showToast("Something wrong happened while load doctors for this clinic", false);
                    })
  }
  function loadAvailabilities(clinicId , doctorId){
    fetch(`${window.currentConfig.apiUrl}/api/Doctor/${doctorId}/availability?clinicId=${clinicId}`)
    .then(res => res.json())
    .then(res => {
      let data = [];
      res.workingHours.$values.forEach((availability) => {
        debugger;
        let obj = {};
        let day = availability.day;
        let halfHours = [];
        availability.slots.$values.forEach((slot) => {
          halfHours.push(slot.startTime);
        });
        obj[`${day}`] = halfHours;
        data.push(obj);
      })
        document.getElementById("message").disabled = false;
        document.getElementById("patientPhone").disabled = false;
        const appointmentComponent = document.getElementById("appointment-booking");
        appointmentComponent.disabled = false;
        appointmentComponent.availability = data;
    })
    .catch(err => {
        showToast("Something wrong happened while load doctors for this clinic", false);
    })
  }

  function createAppointment(){
    const user = JSON.parse(localStorage.getItem("user"));

    let date = document.getElementById("appointment-booking").value;
    // Parse the start time and end time
    const startDate = new Date(date);
    const startTime = startDate.toTimeString().split(' ')[0]; 

    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
    const endTime = endDate.toTimeString().split(' ')[0]; 

    const data = {
      clinicId : document.getElementById("clinicSelect").value,
      doctorId : document.getElementById("doctorSelect").value,
      patientId : user.id,
      appointmentDate : date,
      status : "active",
      startTime : startTime,
      endTime : endTime,
    }
  debugger;
  fetch(`${window.currentConfig.apiUrl}/api/Appointment`,{
    method : "POST",
    body : JSON.stringify(data),
    headers : {
      "Content-Type" : "application/json"
    }
  }).then(res => {
    getAppointment();
    showToast("appointment Booked successfully", true);
    document.getElementById("close-add-appointment-icon-button").click();
  }).catch(err => {
    showToast("Something wrong happened while Booking appointment", false);
  })
  }













  function initSetupAddAppointmentModal(){
    const message = document.getElementById("message");
    message.value = "";
    message.disabled = true;
    const patientPhone = document.getElementById("patientPhone");
    patientPhone.value = "";
    patientPhone.disabled = true;
    const appointmentBooking = document.getElementById("appointment-booking");
    appointmentBooking.value = "";
    appointmentBooking.disabled = true;
    const doctorSelect = document.getElementById("doctorSelect");
    doctorSelect.value = "";
    doctorSelect.disabled = true;
  }