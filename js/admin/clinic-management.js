let addBoolean = true;
document.addEventListener("DOMContentLoaded", function () {
  loadClinics(undefined);
  const openAddFormm = document.getElementById("open-add-clinic"); 
  openAddFormm.addEventListener("click" , (e)=> {
    e.preventDefault();
    add();
  })
});
function add(){
    addBoolean = true;
    console.log("hihi")
    openAddForm();
}
function edit(clinicId){
    addBoolean = false;
    openAddForm(clinicId);
}
function loadClinics(clinic) {
    if(clinic){
        const clinicTable = document.getElementById("clinic-list");
            clinicTable.innerHTML = "";
            window.clinic.forEach(clinic => {
                  const row = document.createElement("tr");
                  row.innerHTML = `
                      <td>${clinic.name}</td>
                      <td>${clinic.address || "Not specified"}</td>
                      <td>${clinic?.openTime || "Not specified"}</td>
                      <td>${clinic?.closeTime  || "Not specified"}</td>
                      <td>${clinic?.daysOpen || "Not specified"}</td>
                      <td>${clinic?.emergencyContact || "Not specified"}</td>
                      <td class="actions">
                          <button class="btn btn-sm btn-primary" onclick="edit('${clinic.clinicId}')">Edit</button>
                          <button class="btn btn-sm btn-danger" onclick="deleteClinic('${clinic.clinicId}')">Delete</button>
                      </td>`;
                  clinicTable.appendChild(row);
              });
    } else {
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
                      <td>${clinic?.emergencyContact || "Not specified"}</td>
                      <td class="actions">
                          <button class="btn btn-sm btn-primary" onclick="edit('${clinic.clinicId}')">Edit</button>
                          <button class="btn btn-sm btn-danger" onclick="deleteClinic('${clinic.clinicId}')">Delete</button>
                      </td>`;
                  clinicTable.appendChild(row);
              });
        })
        .catch(error => console.error("Error loading clinics:", error));
    }
}

function addClinic() {
  const newClinic = {
      name: document.getElementById('clinicName').value,
      address: document.getElementById('clinicLocation').value,
  };

//   newClinic.clinicSettings = {
//     openTime: document.getElementById('clinicOpenTime').value,
//     closeTime: document.getElementById('clinicCloseTime').value,
//     daysOpen: document.getElementById('clinicDaysOpen').value,
//     emergencyContact: document.getElementById('clinicEmergencyContact').value
//   }

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
      const formWrapper = document.getElementById("add-form-wrapper");
    formWrapper.style.display = "none";
  })
  .catch(error => {
    const addMessage = document.getElementById("add-error-message");
    addMessage.innerHTML = "Error Occured";
  });
}

function deleteClinic(clinicId) {
    window.clinic = window.clinic.filter(clinic => clinic.clinicId != clinicId);
    loadClinics(window.clinic);
//   fetch(`${window.currentConfig.apiUrl}/api/clinic/${clinicId}`, {
//       method: "DELETE",
//   })
//   .then(response => {
//       if (!response.ok) {
//           throw new Error('Failed to delete clinic');
//       }
//       loadClinics(); // Reload clinics after deletion
//   })
//   .catch(error => console.error("Error deleting clinic:", error));
}

function editClinic(clinicId) {
    emergencyContact = document.getElementById('clinicEmergencyContact').value;
    const form = document.getElementById('addClinicForm')
    form.removeEventListener("submit", ()=>{})
    form.addEventListener("submit" , (e)=> {
        e.preventDefault();
        window.clinic = window.clinic.map( clinic => {
            if(clinic.clinicId == clinicId){
                const data = {
                    name : document.getElementById('clinicName').value,
                address : document.getElementById('clinicLocation').value,
                openTime : document.getElementById('clinicOpenTime').value,
                closeTime : document.getElementById('clinicCloseTime').value,
                daysOpen : document.getElementById('clinicDaysOpen').value,
                }
                return {...clinic, ...data }
            } else {
                return clinic;
            }
        })
        loadClinics(window.clinic);
        const formWrapper = document.getElementById("add-form-wrapper");
        formWrapper.style.display = "none";
    })
    // Change the form submission to update the clinic
    // document.getElementById('addClinicForm').onsubmit = function(event) {
    //     event.preventDefault();
    //     updateClinic(clinicId);
    // };
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