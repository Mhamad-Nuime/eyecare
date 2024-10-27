// Setup the super admin registration form
function setupSuperAdminRegisterForm() {
    const registerForm = document.getElementById('superAdminRegisterForm');
  
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = document.getElementById("superAdminRegisterForm");
      if(form.checkValidity()){
        const psd =  document.getElementById('registerPassword').value;
        const cpsd =  document.getElementById('registerConfirmPassword').value;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if(!passwordPattern.test(psd)){
          document.getElementById('registerPassword').value = ""
          document.getElementById('registerConfirmPassword').value = "";
          form.checkValidity();
          return;
        }
        if( psd !== cpsd) {
          document.getElementById('registerConfirmPassword').value = "";
          form.checkValidity();
          return;
        }
        const data = {
          name: document.getElementById('registerName').value,
          UserName: document.getElementById('registerName').value,
          email: document.getElementById('registerEmail').value,
          password : psd,
          ConfirmPassword : psd,
          role: "Admin",
        };
          const response = await fetch(`${window.currentConfig.apiUrl}/api/User?password=${psd}`, {  // Replace with your actual API endpoint
            method: 'POST',
            headers: {
              
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
    
          const result = await response.json();
          if (response.ok) {
            showToast('User registered successfully!',true)
            registerForm.reset();
            registerForm.classList.remove('was-validated');
          } else {
            // alert('Registration failed: ' + result.message);
            showToast('An error occurred !!',false)
          }
      }
    });
  }
  