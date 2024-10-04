document.addEventListener('DOMContentLoaded', function () {
    checkUserLoggedIn();
  });
  
  function checkUserLoggedIn() {
    const token = localStorage.getItem('userToken');
    if (!token) {
      window.location.href = '../login.html';
    } else {
      fetchUserProfile(token);
    }
  }
  
  function fetchUserProfile(token) {
    fetch('http://localhost:5018/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('username').textContent = data.username;
        document.getElementById('email').textContent = data.email;
        loadRoleSpecificHeader(data.role);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        localStorage.removeItem('userToken');debugger
        window.location.href = '../login.html';
      });
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
  