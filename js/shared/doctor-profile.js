document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('id');
    if (doctorId) {
        fetchDoctorDetails(doctorId);
    } else {
        console.error('No doctor ID provided.');
    }
});

function fetchDoctorDetails(id) {
    fetch(`${window.currentEnv.apiUrl}/api/doctors/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Safely access and display doctor details
            document.querySelector('.doctor-img img').src = data.imageUrl || 'default-image.jpg';
            document.querySelector('.doctor-details h4').textContent = data.name || 'No Name Provided';
            document.querySelector('.doctor-details p strong').textContent = 'Specialization:';
            document.querySelector('.doctor-details p').textContent = data.specialization || 'Not Specified';
            document.querySelector('.doctor-details .bio').textContent = data.bio || 'No Bio Available';
            // Populate other details if available
            document.querySelector('.doctor-details .qualifications').textContent = data.qualifications || 'Not Specified';
            document.querySelector('.doctor-details .skills').textContent = data.skills || 'Not Specified';
        })
        .catch(error => console.error('Error fetching doctor details:', error));
}
