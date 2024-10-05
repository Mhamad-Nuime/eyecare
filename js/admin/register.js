// Setup the admin registration form
function setupAdminRegisterForm() {
    const registerForm = document.getElementById('adminRegisterForm');
  
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const data = {
        userName: document.getElementById('registerEmail').value,
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        confirmPassword: document.getElementById('registerPassword').value,
        role: document.getElementById('registerRole').value,
      };
  
      try {
        const response = await fetch(`${window.currentConfig.apiUrl}/api/Account/register`, {  // Replace with your actual API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        const result = await response.json();
        if (response.ok && result.success) {
          alert('User registered successfully!');
          registerForm.reset();
          registerForm.classList.remove('was-validated');
        } else {
          alert('Registration failed: ' + result.$values[0].description);
        }
      } catch (error) {
        console.log('An error occurred: ' + error);
      }
    });
  }
  