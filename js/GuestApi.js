// GuestApi.js

// Fetch all doctors, optionally filtered by department
function fetchDoctors(departmentId = null) {
    let url = '/api/doctors';
    if (departmentId) {
        url += `?departmentId=${departmentId}`;
    }
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error('Error fetching doctors:', error));
}

// Fetch all departments
function fetchDepartments() {
    return fetch('/api/departments')
        .then(response => response.json())
        .catch(error => console.error('Error fetching departments:', error));
}

// Fetch all services
function fetchServices() {
    return fetch('/api/services')
        .then(response => response.json())
        .catch(error => console.error('Error fetching services:', error));
}

// Book an appointment, checking if the user is authenticated
function bookAppointment(appointmentData) {
    if (!isUserAuthenticated()) {
        window.location.href = '/login.html';
        return;
    }

    return fetch('/api/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
    }).then(response => response.json())
    .catch(error => console.error('Error booking appointment:', error));
}

// Fetch footer content dynamically
function fetchFooterContent() {
    return fetch('/api/footer')
        .then(response => response.json())
        .catch(error => console.error('Error fetching footer content:', error));
}

// Check if the user is authenticated
function isUserAuthenticated() {
    return !!localStorage.getItem('authToken');
}
