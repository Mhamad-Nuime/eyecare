document.addEventListener("DOMContentLoaded", function () {
    fetchDoctors();
});

function fetchDoctors() {
    fetch(`${window.currentEnv.apiUrl}/api/user/doctors`)
        .then(response => {
            if (!response.ok) {
                showToast("Something went wrong while loading Doctors" ,false)
            }
            return response.json();
        })
        .then(data => {
            const doctorContainer = document.getElementById("doctor-list");

            const doctors = data.$values // Safely access the array

            // Check if doctors is an array
            if (!Array.isArray(doctors)) {
                showToast(`Expected an array but got: ${doctors}`,false)
                doctorContainer.innerHTML = '<p>Error: Data format is incorrect.</p>';
                return;
            }
            if(doctors.length == 0){
                doctorContainer.innerHTML = '<p> No Doctors yet</p>';
                return;
            }

            doctorContainer.innerHTML = ''; // Clear any previous content

            doctors.forEach(doctor =>  {
                const doctorCard = document.createElement('div');
                doctorCard.classList.add('col-lg-4', 'mb-5');
                doctorCard.innerHTML = `
                    <div class="card">
                        <div><img src="${doctor.imageUrl || '../images/blank-user.jpg'}" alt="${doctor.name || 'No Name Provided'}" class="card-img-top" width="100" height="100"></div>
                        <div class="card-body">
                            <h5 class="card-title">${doctor.name || 'No Name Provided'}</h5>
                            <a href="mailto:${doctor.email}"><p class="card-text"><strong>Email :</strong> ${doctor.email || 'Not Specified'}</p></a>
                        </div>
                    </div>`;
                doctorContainer.appendChild(doctorCard);
            });
        })
        .catch(error =>{
            console.error('Error fetching doctors:', error)
            showToast("Error fetching doctors", false);
        });
}

