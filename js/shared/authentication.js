function checkAuthentication() {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('loginLink');
    const profileLink = document.getElementById('profileLink');
  
    if (token) {
      loginLink.style.display = 'none';
      profileLink.style.display = 'block';
    } else {
      loginLink.style.display = 'block';
      profileLink.style.display = 'none';
    }
  }
  // Setup the login form
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
  
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value,
      };
  
      try {
        const response = await fetch('http://localhost:5000/api/login', {  // Replace with your actual API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        const result = await response.json();
        if (response.ok && result.success) {
          localStorage.setItem('token', result.token);
          window.location.href = 'index.html';
        } else {
          alert('Login failed: ' + result.message);
        }
      } catch (error) {
        alert('An error occurred: ' + error.message);
      }
    });
  }
  
  // Setup the register form
  function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
  
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const data = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        phone: document.getElementById('registerPhone').value,
      };
  
      try {
        const response = await fetch('http://localhost:5000/api/register', {  // Replace with your actual API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        const result = await response.json();
        if (response.ok && result.success) {
          alert('Registration successful! Please log in.');
          document.getElementById('login-tab').click();  // Switch to the login tab
        } else {
          alert('Registration failed: ' + result.message);
        }
      } catch (error) {
        alert('An error occurred: ' + error.message);
      }
    });
  }
  