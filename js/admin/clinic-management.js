//TODO : implement addClinic() correctly
//TODO : line 43 : call GET - /Doctors then use createDoctors() with fetch api
//TODO : line 61 : call GET - /clinic/id and fill the fields
//TODO : line 70 : call GET - /Doctors/clinicId=__ 
//TODO : line 161 : call PUT - /clinic/id
//TODO : line 171 : call DELETE - /clinic/id
// NOTE : don't forget to getClinic() after all CRUD Operations

document.addEventListener("DOMContentLoaded", function () {
    showDoctorsmodalConfig();
    addClinicModalConfig();
    editmodalConfig();
    deleteModalConfig()
    loadClinics(undefined);
});
function showDoctorsmodalConfig() {
    const showDoctorsModal = document.getElementById("show-doctros-modal");
    showDoctorsModal.addEventListener("show.bs.modal", (event) => {
      const btn = event.relatedTarget; 
      const clinicId = btn.getAttribute("data-id"); 
      console.log("data-id", clinicId);
      // call doctors?clinicId=__ endpoint
      //then build the body of the table inside the modal
    });
  }
function addClinicModalConfig() {
    // get all doctors associated to this clinic before modal open
    const addModal = document.getElementById("add-clinic-modal");
    addModal.addEventListener("show.bs.modal" , ()=> {
        document.getElementById("add-clinic-form").reset();
        const selectDoctorDropdown = document.getElementById("add-clinic-doctor-select");
        // call /doctor?clinicId=__
        //fetch("").then(res => res.json()).then(res => createDoctors(res))
        const createDoctors = (doctors) => {
            doctors.forEach((doctor) => {
                const option = document.createElement("option");
                option.value = doctor.id;
                option.innerText = doctor.name;
                selectDoctorDropdown.appendChild(option);
            })
        }
    });
  }
function editmodalConfig() {
    // Get modal element
    const editModal = document.getElementById("edit-clinic-modal");
    const editBtn = document.getElementById("edit-clinic-submit-button");
  
    // Pass the clinic id to modal when it's shown
    editModal.addEventListener("shown.bs.modal", (event) => {
        document.getElementById("edit-clinic-form").reset();
         const btn = event.relatedTarget; // Button that triggered the modal
         const clinic = JSON.parse(btn.getAttribute("data-clinic")); // Get data-id from button
         //call : /clinic/id to get clinic data
        document.getElementById("edit-clinic-id").value = clinic.id;
        document.getElementById("edit-clinicName").value = clinic.name;
        document.getElementById("edit-clinicLocation").value = clinic.location;
        document.getElementById("edit-clinicOpenTime").value = clinic.openTime;
        document.getElementById("edit-clinicCloseTime").value = clinic.closeTime;
        document.getElementById("edit-clinicDaysOpen").value = clinic.daysOpen;
        //Get all doctors
        const editDoctorsSelect = document.getElementById("edit-clinic-doctor-select");
        //call : /Doctors/clinicId=__
        const createDoctors = (doctors) => {
            doctors.forEach((doctor) => {
                const option = document.createElement("option");
                option.value = doctor.id;
                option.innerText = doctor.name;
                editDoctorsSelect.appendChild(option);
            })
        }
    });
}
function deleteModalConfig() {
    const deleteModal = document.getElementById("delete-clinic-modal");
    deleteModal.addEventListener("show.bs.modal", (event) => {
      const btn = event.relatedTarget; // Button that triggered the modal
      const clinicId = btn.getAttribute("data-id"); // Get data-id from button
      // Set the appointment id into the hidden field in the form
      const idField = document.getElementById("delete-clinic-id");
      idField.value = clinicId;
    });
  }
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

function addClinic() {
    const form = document.getElementById("add-clinic-form");
    if(form.checkValidity())
    {
        const newClinic = {
            name: document.getElementById('clinicName').value,
            address: document.getElementById('clinicLocation').value,
            openTime: document.getElementById('clinicOpenTime').value,
            closeTime: document.getElementById('clinicCloseTime').value,
            daysOpen: document.getElementById('clinicDaysOpen').value,
            doctors : [document.getElementById("edit-clinic-doctor-select").value],  
      };
    
      fetch(`${window.currentConfig.apiUrl}/api/clinic`, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(newClinic)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to add clinic');
          }
          return response.json();
      })
      .then(data => {
          alert('Clinic added successfully!');
          loadClinics(); // Reload clinics after adding
      })
      .catch(error => {
        const addMessage = document.getElementById("add-error-message");
        addMessage.innerHTML = "Error Occured";
      });
    }

}

function editClinic() {
    const form = document.getElementById("edit-clinic-form");
    if(form.checkValidity()){
        const id = document.getElementById("edit-clinic-id").value;
    const data = {
        name : document.getElementById("edit-clinicName").value,
        location : document.getElementById("edit-clinicLocation").value,
        openTime : document.getElementById("edit-clinicOpenTime").value,
        closeTime : document.getElementById("edit-clinicCloseTime").value,
        daysOpen : document.getElementById("edit-clinicDaysOpen").value,
        doctors : [document.getElementById("edit-clinic-doctor-select").value]
    }
    //call : PUT - /clinic/id and load clinics after that
    loadClinics();
    }
    
}

function deleteClinic() {
    const id = document.getElementById("delete-clinic-id").value;
    debugger;
    // fetch(`${window.currentConfig.apiUrl}/api/clinic/${clinicId}`, {
    //     method: "DELETE",
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Failed to delete clinic');
    //     }
    //     loadClinics(); // Reload clinics after deletion
    // })
    // .catch(error => console.error("Error deleting clinic:", error));
}

function loadClinics(clinic) {
        fetch(`${window.currentConfig.apiUrl}/api/clinic`)
        .then(response => response.json())
        .then(data => {
            const clinicTable = document.getElementById("clinic-list");
            clinicTable.innerHTML = "";
              data.$values.forEach(clinic => {
                  window.clinic.push(clinic)
                  const row = document.createElement("tr");
                  row.innerHTML = `
                      <td>${clinic.name}</td>
                      <td>${clinic.address || "Not specified"}</td>
                      <td>${clinic?.openTime || "Not specified"}</td>
                      <td>${clinic?.closeTime  || "Not specified"}</td>
                      <td>${clinic?.daysOpen || "Not specified"}</td>
                      <td><a id="show-doctors-button" class="text-success" data-id="${clinic.id}" data-bs-toggle="modal" data-bs-target="#show-doctros-modal">show doctors in this clinic</a></td>
                      <td class="actions">
                          <button type="button" id="show-doctors-button" class="btn btn-primary" data-clinic=${JSON.stringify(clinic)} data-bs-toggle="modal" data-bs-target="#edit-clinic-modal">Edit</button>
                          <button type="button" id="show-doctors-button" class="btn btn-danger" data-id="${clinic.clinicId}" data-bs-toggle="modal" data-bs-target="#delete-clinic-modal">Delete</button>
                      </td>`;
                  clinicTable.appendChild(row);
              });
              showToast("Clinics loaded successfull", true)
        })
        .catch(error => console.error("Error loading clinics:", error));
}








function updateClinic(clinicId) {
  const updatedClinic = {
      id: clinicId,
      name: document.getElementById('clinicName').value,
      location: document.getElementById('clinicLocation').value,
      openTime: document.getElementById('clinicOpenTime').value,
      closeTime: document.getElementById('clinicCloseTime').value,
      daysOpen: document.getElementById('clinicDaysOpen').value,
      emergencyContact: document.getElementById('clinicEmergencyContact').value,
  };

  fetch(`${window.currentConfig.apiUrl}/api/admin/clinics/${clinicId}`, {
      method: "PUT",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedClinic)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to update clinic');
      }
      return response.json();
  })
  .then(data => {
      alert('Clinic updated successfully!');
    //   loadClinics(); // Reload clinics after updating
  })
  .catch(error => console.error('Error updating clinic:', error));
}
function openAddForm(clinicId = undefined){
    const formWrapper = document.getElementById("add-form-wrapper");
    formWrapper.style.display = "block";
    const closeButton = document.getElementById("add-form-close-button")
    if(closeButton){
        closeButton.addEventListener("click", () => formWrapper.style.display = "none" );
    }
    if(addBoolean){
        const addForm = document.getElementById("addClinicForm");
        addForm.addEventListener("submit",(event) => {
            event.preventDefault();
            addClinic();
        })
    } else {
        editClinic(clinicId);
    }
}