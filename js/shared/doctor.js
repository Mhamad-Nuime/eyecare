document.addEventListener("DOMContentLoaded", function () {
    fetchDoctors();
});

function fetchDoctors() {
    fetch(`${window.currentEnv.apiUrl}/api/doctor`) // Update with correct API endpoint
        .then(response => response.json())
        .then(doctors => {
            const doctorList = document.getElementById('doctor-list'); // Make sure this ID matches your HTML
            doctorList.innerHTML = ''; // Clear any previous content

            if (doctors.length === 0) {
                doctorList.innerHTML = '<p>No doctors found.</p>';
                return;
            }

            doctors.forEach(doctor => {
                const doctorCard = document.createElement('div');
                doctorCard.classList.add('col-lg-4', 'mb-5');
                doctorCard.innerHTML = `
                    <div class="card">
                        <img src="${doctor.imageUrl || 'default-image.jpg'}" alt="${doctor.name}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${doctor.name}</h5>
                            <p class="card-text">${doctor.specialization}</p>
                            <p class="card-text">${doctor.bio}</p>
                            <a href="doctor-profile.html?id=${doctor.id}" class="btn btn-primary">View Profile</a>
                        </div>
                    </div>`;
                doctorList.appendChild(doctorCard);
            });
        })
        .catch(error => console.error('Error fetching doctors:', error));
}
