document.addEventListener('DOMContentLoaded', function () {
    checkUserLoggedIn();
  });
  
  function checkUserLoggedIn() {
    const userData = JSON.parse(localStorage.getItem('user-data'));
    const userRole = JSON.parse(localStorage.getItem('user-role'));
    const token = localStorage.getItem('userToken');
    if (!token) {
      window.location.href = '../../login.html';
    } else {
      if(userData){
          document.getElementById('username').textContent = userData.name;
          document.getElementById('email').textContent = userData.email;
          loadRoleSpecificHeader(userRole);
      } else {
          console.error('Error fetching profile:', error);
          localStorage.removeItem('userToken');
          window.location.href = '../../login.html';
      }
      fetchUserProfile(token);
    }
  }
  
  function loadRoleSpecificHeader(role) {
    const headerPlaceholder = document.getElementById('header-placeholder');
    
    if (role === 'Admin') {
      headerPlaceholder.innerHTML = `
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" href="index.html">Eye Care</a>
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="../admindash/admin-dashboard.html">Admin Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" href="../admindash/appointment-management.html">Manage Appointments</a></li>
            <li class="nav-item"><a class="nav-link" href="../admindash/user-management.html">Manage Users</a></li>
          </ul>
        </nav>`;
    } else if (role === 'Doctor') {
      headerPlaceholder.innerHTML = `
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" href="index.html">Eye Care</a>
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="doctor-dashboard.html">Doctor Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" href="appointments.html">View Appointments</a></li>
            <li class="nav-item"><a class="nav-link" href="patients.html">Manage Patients</a></li>
          </ul>
        </nav>`;
    } else if (role === 'Patient') {
      headerPlaceholder.innerHTML = `
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" href="index.html">Eye Care</a>
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="appointments.html">My Appointments</a></li>
            <li class="nav-item"><a class="nav-link" href="../clientapp/shared/profile.html">Profile</a></li>
          </ul>
        </nav>`;
    } else {
      headerPlaceholder.innerHTML = `<p>Error: Role not recognized.</p>`;
    }
  }
  