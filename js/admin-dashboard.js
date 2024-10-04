document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html'; // Redirect to login if not authenticated
        return;
    }

    // Fetch Admin Details and Load Initial Data
    fetchAdminDetails(token);
    fetchUsers(token);

    // Event Listeners for Adding Users
    document.getElementById('addUserBtn').addEventListener('click', function() {
        $('#userModal').modal('show'); // Show the add user modal
    });

    document.getElementById('userForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addUser(token);
    });

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

function fetchAdminDetails(token) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/details`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('adminName').textContent = data.name;
    })
    .catch(error => {
        console.error('Error fetching admin details:', error);
    });
}

function fetchUsers(token) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/users`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const userList = document.getElementById('userList');
        userList.innerHTML = ''; // Clear existing users

        data.forEach(user => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `${user.name} (${user.role}) - ${user.email}`;

            // Add Edit and Delete buttons for each user
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-warning float-right ml-2';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editUser(user.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-danger float-right';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteUser(token, user.id));

            listItem.appendChild(editBtn);
            listItem.appendChild(deleteBtn);
            userList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });
}

function addUser(token) {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('userRole').value;
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('userConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    fetch(`${window.currentEnv.apiUrl}/api/admin/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ UserName: email.split('@')[0], name, email, role, password, confirmPassword })
    })
    .then(response => {
        if (response.ok) {
            $('#userModal').modal('hide');
            fetchUsers(token); // Refresh the user list
            alert('User added successfully!');
        } else {
            alert('Failed to add user.');
        }
    })
    .catch(error => {
        console.error('Error adding user:', error);
    });
}

function deleteUser(token, userId) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            fetchUsers(token); // Refresh the user list
            alert('User deleted successfully!');
        } else {
            alert('Failed to delete user.');
        }
    })
    .catch(error => {
        console.error('Error deleting user:', error);
    });
}
function fetchAppointments(token) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/appointments`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const appointmentList = document.getElementById('appointmentList');
        appointmentList.innerHTML = ''; // Clear existing appointments

        data.forEach(appointment => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Appointment with ${appointment.patientName} and Dr. ${appointment.doctorName} on ${appointment.date}`;
            appointmentList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching appointments:', error);
    });
}
function fetchFeedback(token) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/feedback`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const feedbackList = document.getElementById('feedbackList');
        feedbackList.innerHTML = ''; // Clear existing feedback

        data.forEach(feedback => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Feedback from ${feedback.patientName}: ${feedback.content}`;
            feedbackList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching feedback:', error);
    });
}
// Fetch and display users with filtering and searching capabilities
function fetchUsers(token) {
    const searchQuery = document.getElementById('userSearch').value;

    fetch(`${window.currentEnv.apiUrl}/api/admin/users?search=${searchQuery}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const userList = document.getElementById('userList');
        userList.innerHTML = ''; // Clear existing users

        data.forEach(user => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `${user.name} (${user.role}) - ${user.email}`;

            // Add Edit and Delete buttons for each user
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-warning float-right ml-2';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editUser(user.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-danger float-right';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteUser(token, user.id));

            listItem.appendChild(editBtn);
            listItem.appendChild(deleteBtn);
            userList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });
}

// Assign roles while editing a user
function editUser(userId) {
    // Fetch user details
    fetch(`${window.currentEnv.apiUrl}/api/admin/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Populate modal fields with user data
        document.getElementById('userName').value = data.name;
        document.getElementById('userEmail').value = data.email;
        document.getElementById('userRole').value = data.role;
        document.getElementById('userPassword').value = '';
        document.getElementById('userConfirmPassword').value = '';
        
        // Open modal for editing
        $('#userModal').modal('show');
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
    });
}
// Fetch and display appointments with filtering options
function fetchAppointments(token) {
    const filterDate = document.getElementById('appointmentDate').value;
    const filterDoctor = document.getElementById('doctorFilter').value;
    const filterPatient = document.getElementById('patientFilter').value;

    fetch(`${window.currentEnv.apiUrl}/api/admin/appointments?date=${filterDate}&doctor=${filterDoctor}&patient=${filterPatient}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const appointmentList = document.getElementById('appointmentList');
        appointmentList.innerHTML = ''; // Clear existing appointments

        data.forEach(appointment => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Appointment with ${appointment.patientName} and Dr. ${appointment.doctorName} on ${appointment.date}`;

            const rescheduleBtn = document.createElement('button');
            rescheduleBtn.className = 'btn btn-sm btn-info float-right ml-2';
            rescheduleBtn.textContent = 'Reschedule';
            rescheduleBtn.addEventListener('click', () => rescheduleAppointment(appointment.id));

            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-sm btn-danger float-right';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.addEventListener('click', () => cancelAppointment(token, appointment.id));

            listItem.appendChild(rescheduleBtn);
            listItem.appendChild(cancelBtn);
            appointmentList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching appointments:', error);
    });
}

// Reschedule an appointment
function rescheduleAppointment(appointmentId) {
    // Open reschedule modal
    $('#rescheduleModal').modal('show');
    
    // Handle rescheduling logic here...
}
function fetchClinicsAndDepartments(token) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/clinics`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const clinicList = document.getElementById('clinicList');
        clinicList.innerHTML = ''; // Clear existing clinics

        data.forEach(clinic => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `${clinic.name} - Departments: ${clinic.departments.length}`;
            
            // Add buttons to manage departments and assign doctors
            const manageDepartmentsBtn = document.createElement('button');
            manageDepartmentsBtn.className = 'btn btn-sm btn-secondary float-right';
            manageDepartmentsBtn.textContent = 'Manage Departments';
            manageDepartmentsBtn.addEventListener('click', () => manageDepartments(clinic.id));

            listItem.appendChild(manageDepartmentsBtn);
            clinicList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching clinics:', error);
    });
}
function fetchFeedback(token) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/feedback`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const feedbackList = document.getElementById('feedbackList');
        feedbackList.innerHTML = ''; // Clear existing feedback

        data.forEach(feedback => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Feedback from ${feedback.patientName}: ${feedback.content}`;

            const respondBtn = document.createElement('button');
            respondBtn.className = 'btn btn-sm btn-primary float-right';
            respondBtn.textContent = 'Respond';
            respondBtn.addEventListener('click', () => respondToFeedback(feedback.id));

            listItem.appendChild(respondBtn);
            feedbackList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching feedback:', error);
    });
}

function respondToFeedback(feedbackId) {
    // Open respond modal
    $('#respondModal').modal('show');

    // Handle response logic here...
}
function fetchSystemLogs(token) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/logs`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const logList = document.getElementById('logList');
        logList.innerHTML = ''; // Clear existing logs

        data.forEach(log => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `${log.timestamp} - ${log.message}`;
            logList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching system logs:', error);
    });
}

function fetchActiveSessions(token) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/sessions`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const sessionList = document.getElementById('sessionList');
        sessionList.innerHTML = ''; // Clear existing sessions

        data.forEach(session => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Session ID: ${session.id} - User: ${session.userName}`;

            const terminateBtn = document.createElement('button');
            terminateBtn.className = 'btn btn-sm btn-danger float-right';
            terminateBtn.textContent = 'Terminate';
            terminateBtn.addEventListener('click', () => terminateSession(session.id));

            listItem.appendChild(terminateBtn);
            sessionList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching active sessions:', error);
    });
}
function fetchDashboardMetrics(token) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/metrics`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('totalUsers').textContent = data.totalUsers;
        document.getElementById('activeAppointments').textContent = data.activeAppointments;
        document.getElementById('feedbackCount').textContent = data.feedbackCount;
    })
    .catch(error => {
        console.error('Error fetching dashboard metrics:', error);
    });
}

function renderCharts(token) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/charts`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Render charts using a library like Chart.js
        const ctx = document.getElementById('appointmentsChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Appointments Over Time',
                    data: data.appointments,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            }
        });
    })
    .catch(error => {
        console.error('Error fetching chart data:', error);
    });
}
function enforceRoleBasedAccess(token) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/access`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Show/hide sections based on user role
        if (!data.canManageUsers) {
            document.getElementById('userManagementSection').style.display = 'none';
        }
        if (!data.canManageAppointments) {
            document.getElementById('appointmentsSection').style.display = 'none';
        }
        // Add other role-based access checks here...
    })
    .catch(error => {
        console.error('Error enforcing role-based access:', error);
    });
}
function editUser(userId) {
    const token = localStorage.getItem('token');

    fetch(`${window.currentEnv.apiUrl}/api/admin/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('userName').value = data.name;
        document.getElementById('userEmail').value = data.email;
        document.getElementById('userRole').value = data.role;
        document.getElementById('userPassword').value = '';
        document.getElementById('userConfirmPassword').value = '';
        
        $('#userModal').modal('show');

        // Handle form submission for updating user
        document.getElementById('userForm').onsubmit = function(event) {
            event.preventDefault();
            updateUser(token, userId);
        };
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
    });
}

function updateUser(token, userId) {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('userRole').value;
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('userConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    fetch(`${window.currentEnv.apiUrl}/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, role, password, confirmPassword })
    })
    .then(response => {
        if (response.ok) {
            $('#userModal').modal('hide');
            fetchUsers(token);
            alert('User updated successfully!');
        } else {
            alert('Failed to update user.');
        }
    })
    .catch(error => {
        console.error('Error updating user:', error);
    });
}
function rescheduleAppointment(appointmentId) {
    $('#rescheduleModal').modal('show');

    document.getElementById('rescheduleForm').onsubmit = function(event) {
        event.preventDefault();
        const newDate = document.getElementById('newAppointmentDate').value;
        const token = localStorage.getItem('token');

        fetch(`${window.currentEnv.apiUrl}/api/admin/appointments/${appointmentId}/reschedule`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ newDate })
        })
        .then(response => {
            if (response.ok) {
                $('#rescheduleModal').modal('hide');
                fetchAppointments(token);
                alert('Appointment rescheduled successfully!');
            } else {
                alert('Failed to reschedule appointment.');
            }
        })
        .catch(error => {
            console.error('Error rescheduling appointment:', error);
        });
    };
}
function manageDepartments(clinicId) {
    const token = localStorage.getItem('token');

    fetch(`${window.currentEnv.apiUrl}/api/admin/clinics/${clinicId}/departments`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const departmentList = document.getElementById('departmentList');
        departmentList.innerHTML = ''; 

        data.forEach(department => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `${department.name}`;

            const assignDoctorBtn = document.createElement('button');
            assignDoctorBtn.className = 'btn btn-sm btn-info float-right';
            assignDoctorBtn.textContent = 'Assign Doctor';
            assignDoctorBtn.addEventListener('click', () => assignDoctor(department.id));

            listItem.appendChild(assignDoctorBtn);
            departmentList.appendChild(listItem);
        });

        $('#departmentModal').modal('show');
    })
    .catch(error => {
        console.error('Error fetching departments:', error);
    });
}

function assignDoctor(departmentId) {
    $('#assignDoctorModal').modal('show');

    document.getElementById('assignDoctorForm').onsubmit = function(event) {
        event.preventDefault();
        const doctorId = document.getElementById('doctorSelect').value;
        const token = localStorage.getItem('token');

        fetch(`${window.currentEnv.apiUrl}/api/admin/departments/${departmentId}/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ doctorId })
        })
        .then(response => {
            if (response.ok) {
                $('#assignDoctorModal').modal('hide');
                alert('Doctor assigned successfully!');
            } else {
                alert('Failed to assign doctor.');
            }
        })
        .catch(error => {
            console.error('Error assigning doctor:', error);
        });
    };
}
function respondToFeedback(feedbackId) {
    $('#respondModal').modal('show');

    document.getElementById('respondForm').onsubmit = function(event) {
        event.preventDefault();
        const responseText = document.getElementById('responseText').value;
        const token = localStorage.getItem('token');

        fetch(`${window.currentEnv.apiUrl}/api/admin/feedback/${feedbackId}/respond`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ responseText })
        })
        .then(response => {
            if (response.ok) {
                $('#respondModal').modal('hide');
                fetchFeedback(token);
                alert('Response sent successfully!');
            } else {
                alert('Failed to send response.');
            }
        })
        .catch(error => {
            console.error('Error sending response:', error);
        });
    };
}
function terminateSession(sessionId) {
    const token = localStorage.getItem('token');

    fetch(`${window.currentEnv.apiUrl}/api/admin/sessions/${sessionId}/terminate`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            fetchActiveSessions(token);
            alert('Session terminated successfully!');
        } else {
            alert('Failed to terminate session.');
        }
    })
    .catch(error => {
        console.error('Error terminating session:', error);
    });
}
