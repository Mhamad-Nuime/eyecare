document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('id');
    if (doctorId) {
        fetchDoctorDetails(doctorId);
    }
});

function fetchDoctorDetails(id) {
    fetch(`${window.currentEnv.apiUrl}/api/doctors/${id}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('.doctor-img img').src = data.imageUrl;
            document.querySelector('.doctor-details h4').textContent = data.name;
            document.querySelector('.doctor-details p').textContent = data.specialization;
            document.querySelector('.doctor-details .bio').textContent = data.bio;

            // Populate other details like qualifications and skills similarly
        })
        .catch(error => console.error('Error fetching doctor details:', error));
}
