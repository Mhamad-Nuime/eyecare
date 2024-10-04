// api.js
constAPI_BASE_URL = "http://localhost:5000/api"; // Update based on your backend
// Fetch all departments 
async function fetchDepartments() {
    const response = awaitfetch(`${API_BASE_URL}/departments`);
    return await response.json();
}

// Fetch doctors by department
async function fetchDoctors(departmentId) {
    const response = awaitfetch(`${API_BASE_URL}/doctors?departmentId=${departmentId}`);
    return await response.json();
}

// Book an appointment
async function bookAppointment(data) {
    const response = awaitfetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

// Fetch user appointments
async function fetchUserAppointments() {
    const response = awaitfetch(`${API_BASE_URL}/appointments/myappointments`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return await response.json();
}
// Fetch user profile data
async function fetchUserProfile() {
    const response = awaitfetch(`${API_BASE_URL}/account/profile`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return await response.json();
}

// Other API logic can be added here