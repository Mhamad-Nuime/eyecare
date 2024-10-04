document.addEventListener('DOMContentLoaded', function () {
    // Login functionality
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch(`${window.currentConfig.apiUrl}/api/account/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                mode: 'cors',
                
            });
            debugger;

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userToken', data.token); // Store JWT token

                // Use jwt-decode to decode token
                const decodedToken = jwt_decode(data.token);
                const userRole = decodedToken.role; // Ensure role is part of the token payload

                // Redirect based on role
                switch (userRole) {
                    case 'Patient':
                        window.location.href = '/clientapp/Patientdashboard/patient-dashboard.html';
                        break;
                    case 'Doctor':
                        window.location.href = '/clientapp/doctordash/doctor-dashboard.html';
                        break;
                    case 'Admin':
                        window.location.href = '/clientapp/admindash/admin-dashboard.html';
                        break;
                    case 'SuperAdmin':
                        window.location.href = '/clientapp/Superadmindash/superadmin-dashboard.html';
                        break;
                    default:
                        window.location.href = '/clientapp/shared/profile.html'; // Default fallback
                        break;
                }
            } else {
                const errorData = await response.json();
                document.getElementById('loginError').textContent = errorData.message || 'Invalid login credentials';
            }
        } catch (error) {
            document.getElementById('loginError').textContent = 'An error occurred. Please try again.';
        }
    });


  
    // Signup functionality
    document.getElementById('signupForm').addEventListener('submit', async function(event) {
        event.preventDefault();
  
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const role = "Patient"; // Default role
  
        if (password !== confirmPassword) {
            document.getElementById('signupError').textContent = 'Passwords do not match!';
            return;
        }
  
        try {
            const response = await fetch(`${window.currentConfig.apiUrl}/api/account/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    UserName: name.replace(/\s+/g, '').toLowerCase(),
                    name,
                    email,
                    password,
                    confirmPassword,
                    role
                })
            });
  
            const data = await response.json();
  
            if (response.status === 409) {
                document.getElementById('signupError').textContent = 'User already registered with this email.';
            } else if (response.ok) {
                localStorage.setItem('userToken', data.token); // Store JWT token
                document.getElementById('signupError').textContent = '';
                 // Use jwt-decode to decode token
                 const decodedToken = jwt_decode(data.token);
                 const userRole = decodedToken.role;// Ensure role is part of the token payload
                 debugger 
                // Redirect based on role
                switch (userRole) {
                    case 'Patient':
                        window.location.href = '/clientapp/Patientdashboard/patient-dashboard.html';
                        break;
                    case 'Doctor':
                        window.location.href = '/clientapp/doctordash/doctor-dashboard.html';
                        break;
                    case 'Admin':
                        window.location.href = '/clientapp/admindash/admin-dashboard.html';
                        break;
                    case 'SuperAdmin':
                        window.location.href = '/clientapp/Superadmindash/superadmin-dashboard.html';
                        break;
                    default:
                        window.location.href = '/clientapp/shared/profile.html'; // Default fallback
                        break;
                }
            } else {
                document.getElementById('signupError').textContent = data.message || 'Signup failed, try again.';
            }
        } catch (error) {
            document.getElementById('signupError').textContent = 'An error occurred. Please try again.';
        }
    });
});
