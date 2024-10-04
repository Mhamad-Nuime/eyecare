// Setup the admin registration form
function setupAdminRegisterForm() {
    const registerForm = document.getElementById('adminRegisterForm');
  
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const data = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        phone: document.getElementById('registerPhone').value,
        role: document.getElementById('registerRole').value,
      };
  
      try {
        const response = await fetch('http://localhost:5000/api/admin/register', {  // Replace with your actual API endpoint
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
          alert('Registration failed: ' + result.message);
        }
      } catch (error) {
        alert('An error occurred: ' + error.message);
      }
    });
  }
  