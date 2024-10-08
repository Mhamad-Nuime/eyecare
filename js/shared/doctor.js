document.addEventListener("DOMContentLoaded", function () {
    fetchDoctors();
});

function fetchDoctors() {
    fetch(`${window.currentEnv.apiUrl}/api/doctorprofile/getalldoctorprofiles`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Log the response to see its structure
            console.log('Doctors response:', data); // Debugging log
            
            // Access the $values array
            const doctors = data.$values || []; // Safely access the array

            // Check if doctors is an array
            if (!Array.isArray(doctors)) {
                console.error('Expected an array but got:', doctors);
                document.getElementById('doctor-list').innerHTML = '<p>Error: Data format is incorrect.</p>';
                return;
            }

            const doctorList = document.getElementById('doctor-list'); // Ensure this ID matches your HTML
            doctorList.innerHTML = ''; // Clear any previous content

            if (doctors.length === 0) {
                doctorList.innerHTML = '<p>No doctors found.</p>';
                return;
            }
            fetch(`${window.currentConfig.apiUrl}/api/users/all`, {
                headers: {
                  //   'Authorization': `Bearer ${token}`,  // Include token in Authorization header
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((data) => {
                data.$values.forEach((user) => {
                console.log(user);
                if(user.role == "doctor") window.doctors.push(user);
            });
            })
            doctors.forEach(doctor =>  window.doctors.push(doctor));
            window.doctors.forEach(doctor =>  {
                const doctorCard = document.createElement('div');
                doctorCard.classList.add('col-lg-4', 'mb-5');
                doctorCard.innerHTML = `
                    <div class="card">
                        <img src="${doctor.imageUrl || 'default-image.jpg'}" alt="${doctor.name || 'No Name Provided'}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${doctor.name || 'No Name Provided'}</h5>
                            <p class="card-text"><strong>Specialization:</strong> ${doctor.specialization || 'Not Specified'}</p>
                            <p class="card-text">${doctor.bio || 'No Bio Available'}</p>
                            <a href="doctor-profile.html?id=${doctor.id}" class="btn btn-primary">View Profile</a>
                        </div>
                    </div>`;
                doctorList.appendChild(doctorCard);
            });
        })
        .catch(error => console.error('Error fetching doctors:', error));
}
