document.addEventListener('DOMContentLoaded', function () {
    const loginCard = document.getElementById('loginCard');
    const signupCard = document.getElementById('signupCard');
  
    // Toggle to Signup
    document.getElementById('toggleToSignup').addEventListener('click', function () {
        loginCard.classList.add('d-none');
        signupCard.classList.remove('d-none');
    });
  
    // Toggle to Login
    document.getElementById('toggleToLogin').addEventListener('click', function () {
        signupCard.classList.add('d-none');
        loginCard.classList.remove('d-none');
    });
  
    // Login functionality
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const form = document.getElementById('loginForm');
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
  
        // Validate fields
        if (!form.checkValidity()) {
          form.classList.add('was-validated');
            return;
        }
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
          if(!passwordPattern.test(password)){
            document.getElementById('loginPassword').value = "";
            form.classList.add('was-validated');
            form.checkValidity();
            return;
          }
  
        try {
            const response = await fetch(`${window.currentConfig.apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        email : email,
                        password : password,
                        rememberMe : false
                    }
                )
            });
            const data = response.json();
            if (response.ok) {
                showToast("login succesfully", true);
                localStorage.setItem("user", JSON.stringify(data));
                // Redirect based on role
                switch (data.role) {
                    case 'Patient':
                        window.location.href = '../Patientdashboard/patient-dashboard.html';
                        break;
                    case 'Doctor':
                        window.location.href = '../doctordash/doctor-dashboard.html';
                        break;
                    case 'Admin':
                        window.location.href = '../admindash/admin-dashboard.html';
                        break;
                    case 'SuperAdmin':
                        showToast("something wrong happened while navigate to your dashboard", false);
                        break;
                }
            } else {
                const errorData = await response.json();
                showToast("An error occurred. Please try again", false);
            }
        } catch (error) {
          showToast("An error occurred. Please try again", false);
        }
    });
  
    // Signup functionality
    document.getElementById('signupForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const form = document.getElementById('signupForm');
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const role = "Patient"; // Default role
  
        // Validate fields
        if (!form.checkValidity()) {
            event.stopPropagation();
            this.classList.add('was-validated');
            return;
        }
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
          if(!passwordPattern.test(password)){
            document.getElementById('signupPassword').value = ""
            document.getElementById('signupConfirmPassword').value = "";
            form.classList.add('was-validated');
            form.checkValidity();
            return;
          }
        if (password !== confirmPassword) {
          document.getElementById('signupConfirmPassword').value ="";
          form.classList.add('was-validated');
          form.checkValidity();
            return;
        }
  
        try {
            const response = await fetch(`${window.currentConfig.apiUrl}/api/users/register?password=${password}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    UserName: name,
                    name : name,
                    email :email,
                    role : role,
                })
            });
  
            const data = await response.json();
  
            if (response.status === 409) {
                showToast("User already registered with this email" ,false);
                } else if (response.ok) {
                    showToast("Account get registered successfully",true)
                    debugger;
                localStorage.setItem('user', JSON.stringify(data)); // Store JWT token
                const userRole = data.role; // Ensure role is part of the token payload
                // Redirect based on role
                switch (userRole) {
                    case 'Patient':
                        window.location.href = '../Patientdashboard/patient-dashboard.html';
                        break;
                    case 'Doctor':
                        window.location.href = '../doctordash/doctor-dashboard.html';
                        break;
                    case 'Admin':
                        window.location.href = '../admindash/admin-dashboard.html';
                        break;
                    case 'SuperAdmin':
                        window.location.href = '../Superadmindash/superadmin-dashboard.html';
                        break;
                    default:
                        showToast("something wrong happened while navigate to your dashboard", false);
                        break;
                }
            } else {
              showToast("An error occurred. Please try again", false);
            }
        } catch (error) {
          showToast("An error occurred. Please try again", false);
        }
    });
  });