document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetchDoctorProfile(token);

    document.getElementById('profileForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateDoctorProfile(token);
    });

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

function fetchDoctorProfile(token) {
    fetch('http://localhost:7276/api/doctor/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('doctorName').value = data.name;
        document.getElementById('doctorEmail').value = data.email;
        document.getElementById('doctorSpecialization').value = data.specialization;
        document.getElementById('doctorBio').value = data.bio;
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
    });
}

function updateDoctorProfile(token) {
    const name = document.getElementById('doctorName').value;
    const specialization = document.getElementById('doctorSpecialization').value;
    const bio = document.getElementById('doctorBio').value;
    const password = document.getElementById('doctorPassword').value;
    const confirmPassword = document.getElementById('doctorConfirmPassword').value;

    if (password && password !== confirmPassword) {
        document.getElementById('updateMessage').textContent = 'Passwords do not match!';
        return;
    }

    fetch('http://localhost:7276/api/doctor/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, specialization, bio, password })
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('updateMessage').textContent = 'Profile updated successfully!';
        } else {
            document.getElementById('updateMessage').textContent = 'Failed to update profile.';
        }
    })
    .catch(error => {
        console.error('Error updating profile:', error);
    });
}
