document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetchClinicSettings(token);

    document.getElementById('clinicForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateClinicSettings(token);
    });

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

function fetchClinicSettings(token) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/clinic`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('clinicName').value = data.name;
        document.getElementById('openTime').value = data.openTime;
        document.getElementById('closeTime').value = data.closeTime;
        document.getElementById('daysOpen').value = data.daysOpen.join(', ');
    })
    .catch(error => {
        console.error('Error fetching clinic settings:', error);
    });
}

function updateClinicSettings(token) {
    const name = document.getElementById('clinicName').value;
    const openTime = document.getElementById('openTime').value;
    const closeTime = document.getElementById('closeTime').value;
    const daysOpen = document.getElementById('daysOpen').value.split(',').map(day => day.trim());

    fetch(`${window.currentEnv.apiUrl}/api/admin/clinic`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, openTime, closeTime, daysOpen })
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('updateMessage').textContent = 'Clinic updated successfully!';
        } else {
            document.getElementById('updateMessage').textContent = 'Failed to update clinic.';
        }
    })
    .catch(error => {
        console.error('Error updating clinic settings:', error);
    });
}
