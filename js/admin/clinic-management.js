document.addEventListener("DOMContentLoaded", function () {
  loadClinics();
});

function loadClinics() {
  fetch(`${window.currentConfig.apiUrl}/api/admin/clinic`)
      .then(response => response.json())
      .then(data => {
          const clinicTable = document.getElementById("clinic-list");
          clinicTable.innerHTML = "";
          data.forEach(clinic => {
              const row = document.createElement("tr");
              row.innerHTML = `
                  <td>${clinic.name}</td>
                  <td>${clinic.location || "Not specified"}</td>
                  <td>${clinic.openTime}</td>
                  <td>${clinic.closeTime}</td>
                  <td>${clinic.daysOpen}</td>
                  <td>${clinic.emergencyContact}</td>
                  <td>
                      <button class="btn btn-sm btn-primary" onclick="editClinic('${clinic.id}')">Edit</button>
                      <button class="btn btn-sm btn-danger" onclick="deleteClinic('${clinic.id}')">Delete</button>
                  </td>`;
              clinicTable.appendChild(row);
          });
      })
      .catch(error => console.error("Error loading clinics:", error));
}

function addClinic() {
  const newClinic = {
      name: document.getElementById('clinicName').value,
      location: document.getElementById('clinicLocation').value,
      openTime: document.getElementById('clinicOpenTime').value,
      closeTime: document.getElementById('clinicCloseTime').value,
      daysOpen: document.getElementById('clinicDaysOpen').value,
      emergencyContact: document.getElementById('clinicEmergencyContact').value
  };

  fetch(`${window.currentConfig.apiUrl}/api/admin/clinic`, {
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
  .catch(error => console.error('Error adding clinic:', error));
}

// Call addClinic function on form submission
document.getElementById('addClinicForm').addEventListener('submit', function(event) {
  event.preventDefault();
  addClinic();
});

function deleteClinic(clinicId) {
  fetch(`${window.currentConfig.apiUrl}/api/admin/clinics/${clinicId}`, {
      method: "DELETE",
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to delete clinic');
      }
      loadClinics(); // Reload clinics after deletion
  })
  .catch(error => console.error("Error deleting clinic:", error));
}

function editClinic(clinicId) {
  fetch(`${window.currentConfig.apiUrl}/api/admin/clinics/${clinicId}`)
      .then(response => response.json())
      .then(clinic => {
          document.getElementById('clinicName').value = clinic.name;
          document.getElementById('clinicLocation').value = clinic.location || '';
          document.getElementById('clinicOpenTime').value = clinic.openTime;
          document.getElementById('clinicCloseTime').value = clinic.closeTime;
          document.getElementById('clinicDaysOpen').value = clinic.daysOpen;
          document.getElementById('clinicEmergencyContact').value = clinic.emergencyContact;

          // Change the form submission to update the clinic
          document.getElementById('addClinicForm').onsubmit = function(event) {
              event.preventDefault();
              updateClinic(clinicId);
          };

          // Show the modal for editing
          $('#addClinicModal').modal('show');
      })
      .catch(error => console.error('Error loading clinic for edit:', error));
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
      loadClinics(); // Reload clinics after updating
  })
  .catch(error => console.error('Error updating clinic:', error));
}
