document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');

  // if (!token) {
  //     window.location.href = '/login.html'; // Redirect to login if not authenticated
  //     return;
  // }

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
  fetch(`${window.currentEnv.apiUrl}/api/admin`, {
      method: 'GET'})
  .then(response => response.json())
  .then(data => {
      document.getElementById('adminName').innerText = data.$values[0].name;
  })
  .catch(error => {
      console.error('Error fetching admin details:', error);
  });
}