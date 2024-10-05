document.addEventListener("DOMContentLoaded", function () {
    loadClinics();
  });
  
  function loadClinics() {
    fetch(`${window.currentConfig.apiUrl}/api/admin/clinics`)
      .then((response) => response.json())
      .then((data) => {
        const clinicTable = document.getElementById("clinic-list");
        clinicTable.innerHTML = "";
        data.forEach((clinic) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${clinic.name}</td>
            <td>${clinic.location}</td>
            <td>${clinic.departments.join(", ")}</td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="editClinic('${clinic.id}')">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteClinic('${clinic.id}')">Delete</button>
            </td>`;
          clinicTable.appendChild(row);
        });
      })
      .catch((error) => console.error("Error loading clinics:", error));
  }
  
  function deleteClinic(clinicId) {
    fetch(`${window.currentConfig.apiUrl}/api/admin/clinics/${clinicId}`, {
      method: "DELETE",
    })
      .then(() => loadClinics())
      .catch((error) => console.error("Error deleting clinic:", error));
  }
  
  function editClinic(clinicId) {
    // Implement edit functionality
  }
  