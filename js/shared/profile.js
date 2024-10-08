document.addEventListener('DOMContentLoaded', function () {
  checkUserLoggedIn();

  // Auto-fill form and toggle visibility
  document.getElementById('edit-profile').addEventListener('click', function () {
      document.getElementById('edit-username').value = document.getElementById('username').textContent;
      document.getElementById('edit-email').value = document.getElementById('email').textContent;
      document.querySelector('.edit-profile-container').style.display = 'block';
  });

  // Handle form submission
  document.getElementById('edit-profile-form').addEventListener('submit', function (event) {
      event.preventDefault();
      const updatedName = document.getElementById('edit-username').value;
      const updatedEmail = document.getElementById('edit-email').value;

      // Assuming you're saving to localStorage, modify as needed
      const userData = {
          name: updatedName,
          email: updatedEmail
      };
      localStorage.setItem('user-data', JSON.stringify(userData));

      // Update the visible profile data
      document.getElementById('username').textContent = updatedName;
      document.getElementById('email').textContent = updatedEmail;

      document.querySelector('.edit-profile-container').style.display = 'none';
  });

  // Handle back button navigation
  document.getElementById('back-button').addEventListener('click', function () {
      navigateBackBasedOnRole();
  });
});

// Check if the user is logged in and load header based on role
function checkUserLoggedIn() {
  const token = localStorage.getItem('userToken');
  const userData = JSON.parse(localStorage.getItem('user-data'));
  const userRole = JSON.parse(localStorage.getItem('user-role'));
  
  if (!token) {
      window.location.href = '../../login.html';
  } else {
      if (userData) {
          document.getElementById('username').textContent = userData.name;
          document.getElementById('email').textContent = userData.email;
          loadRoleSpecificHeader(userRole);
      } else {
          localStorage.removeItem('userToken');
          window.location.href = '../../login.html';
      }
  }
}

// Load header based on user role
function loadRoleSpecificHeader(role) {
  const headerPlaceholder = document.getElementById('header-placeholder');
  
  let headerContent = '';
  if (role === 'Admin') {
      headerContent = `
          <nav class="navbar navbar-expand-lg">
              <a class="navbar-brand" href="index.html">Eye Care</a>
              <ul class="navbar-nav">
                  <li class="nav-item"><a class="nav-link" href="../admindash/admin-dashboard.html">Admin Dashboard</a></li>
                  <li class="nav-item"><a class="nav-link" href="../admindash/appointment-management.html">Manage Appointments</a></li>
                  <li class="nav-item"><a class="nav-link" href="../admindash/user-management.html">Manage Users</a></li>
              </ul>
          </nav>`;
  } else if (role === 'Doctor') {
      headerContent = `
          <nav class="navbar navbar-expand-lg">
              <a class="navbar-brand" href="index.html">Eye Care</a>
              <ul class="navbar-nav">
                  <li class="nav-item"><a class="nav-link" href="doctor-dashboard.html">Doctor Dashboard</a></li>
                  <li class="nav-item"><a class="nav-link" href="appointments.html">View Appointments</a></li>
                  <li class="nav-item"><a class="nav-link" href="patients.html">Manage Patients</a></li>
              </ul>
          </nav>`;
  } else if (role === 'Patient') {
      headerContent = `
          <nav class="navbar navbar-expand-lg">
              <a class="navbar-brand" href="index.html">Eye Care</a>
              <ul class="navbar-nav">
                  <li class="nav-item"><a class="nav-link" href="appointments.html">My Appointments</a></li>
                  <li class="nav-item"><a class="nav-link" href="../clientapp/shared/profile.html">Profile</a></li>
              </ul>
          </nav>`;
  } else {
      headerContent = `<p>Error: Role not recognized.</p>`;
  }
  
  headerPlaceholder.innerHTML = headerContent;
}

// Navigate to the role-based back page
function navigateBackBasedOnRole() {
  const userRole = JSON.parse(localStorage.getItem('user-role'));
  
  let backUrl = '';
  if (userRole === 'Admin') {
      backUrl = '../admindash/admin-dashboard.html';  // Admin back to dashboard
  } else if (userRole === 'Doctor') {
      backUrl = '../doctordash/doctor-dashboard.html';  // Doctor back to doctor dashboard
  } else if (userRole === 'Patient') {
      backUrl = 'appointments.html';  // Patient back to appointments
  } else {
      backUrl = '../../login.html';  // Default to login page in case of any issues
  }

  // Navigate to the determined URL
  window.location.href = backUrl;
}
