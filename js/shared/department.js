document.addEventListener("DOMContentLoaded", function () {
    fetchClinicsWithDepartments();
});

 // Function to fetch clinics with departments
 function fetchClinicsWithDepartments() {
     fetch(`${window.currentEnv.apiUrl}/api/clinic`)
         .then(response => response.json())
         .then(data => {
             const clinics = data.$values || []; // Access the clinics array

             if (clinics.length > 0) {
                 const clinicsList = document.getElementById('clinics-list');
                 clinicsList.innerHTML = '';

                 clinics.forEach(clinic => {
                     const departments = clinic.departments.$values || []; // Access the departments array

                     const departmentsList = departments.length > 0 
                         ? departments.map(department => `<li>${department.name}</li>`).join('') 
                         : '<li>No departments available</li>'; // Fallback message

                     const clinicCard = `
                         <div class="col-lg-4 col-md-6">
                             <div class="clinic-card" onclick="showClinicDetails('${clinic.clinicId}')">
                                 <div class="clinic-card-header">
                                     <h3>${clinic.name}</h3>
                                 </div>
                                 <div class="clinic-card-body">
                                     <p><strong>Address:</strong> ${clinic.address}</p>
                                     <h4>Departments:</h4>
                                     <ul>${departmentsList}</ul>
                                 </div>
                             </div>
                         </div>`;

                     clinicsList.innerHTML += clinicCard; // Append the card to the clinics list
                 });
             } else {
                 console.error('No clinics found');
             }
         })
         .catch(error => console.error('Error fetching clinics:', error));
 }

 // Function to show details of a clinic when clicked
 function showClinicDetails(clinicId) {
     fetch(`${window.currentEnv.apiUrl}/api/clinic/department?clinicId=${clinicId}`)
         .then(response => response.json())
         .then(data => {
             const departments = data.$values || []; // Access the departments array
             const detailsContainer = document.getElementById('clinic-details');

             // Create details content
             detailsContainer.innerHTML = `
                 <h2>${data.$values[0].clinic.name}</h2>
                 <p><strong>Address:</strong> ${data.$values[0].clinic.address}</p>
                 <h4>Departments:</h4>
                 <ul>
                     ${departments.length > 0 
                         ? departments.map(department => `
                             <li>
                                 <strong>${department.name}</strong> - ${department.description} <br>
                                 <img src="${department.imageUrl || 'default-image.png'}" alt="${department.name}" style="width: 100px; height: auto;">
                                 <p><strong>Phone:</strong> ${department.phone}</p>
                             </li>`).join('') 
                         : '<li>No departments available</li>'}
                 </ul>
             `;

             detailsContainer.style.display = 'block'; // Show the details container
         })
         .catch(error => console.error('Error fetching clinic details:', error));
 }
