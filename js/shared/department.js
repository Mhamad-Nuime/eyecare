document.addEventListener("DOMContentLoaded", function () {
    fetchClinicsWithDepartments();
});

function fetchClinicsWithDepartments() {
    fetch('http://localhost:5018/api/clinic') // Replace with the actual clinics endpoint
        .then(response => response.json())
        .then(clinics => {
            const clinicsList = document.getElementById('clinics-list');
            clinicsList.innerHTML = ''; // Clear existing content

            clinics.forEach(clinic => {
                // Create a Bootstrap card for each clinic
                const clinicCard = document.createElement('div');
                clinicCard.classList.add('col-lg-4', 'col-md-6', 'mb-4'); // Responsive columns

                clinicCard.innerHTML = `
                <div class="card h-100 shadow-sm" onclick="window.location.href='department-details.html?clinicId=${clinic.clinicId}'" style="cursor: pointer;">
                    <img src="${clinic.imageUrl}" alt="${clinic.name}" class="card-img-top" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${clinic.name}</h5>
                        <p class="card-text">${clinic.address}</p>
                    </div>
                    <div class="card-footer">
                        <h6>Departments:</h6>
                        <ul id="clinic-departments-${clinic.id}" class="list-unstyled">
                            <!-- Departments will be loaded here -->
                        </ul>
                    </div>
                </div>
            `;
            

                clinicsList.appendChild(clinicCard);

                // Fetch and display the departments for each clinic
                fetchDepartmentsForClinic(clinic.id);
            });
        })
        .catch(error => console.error('Error fetching clinics:', error));
}

function fetchDepartmentsForClinic(clinicId) {
    fetch(`http://localhost:5018/api/clinic/department/${clinicId}`) // Replace with actual endpoint for clinic departments
        .then(response => response.json())
        .then(departments => {
            const departmentList = document.getElementById(`clinic-departments-${clinicId}`);
            departmentList.innerHTML = ''; // Clear existing content

            if (departments.length > 0) {
                departments.forEach(department => {
                    const departmentItem = document.createElement('li');
                    departmentItem.innerHTML = `
                        <a href="department-details.html?id=${department.id}">
                            ${department.name}
                        </a>`;
                    departmentList.appendChild(departmentItem);
                });
            } else {
                departmentList.innerHTML = '<li>No departments available</li>';
            }
        })
        .catch(error => console.error(`Error fetching departments for clinic ${clinicId}:`, error));
}
