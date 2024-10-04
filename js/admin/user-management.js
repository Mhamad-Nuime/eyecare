document.addEventListener("DOMContentLoaded", function () {
  loadUsers();
});

function loadUsers() {
  // Get the JWT token from localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
      console.error("No token found. Redirecting to login.");
      window.location.href = '../login.html'; // Redirect to login if no token
      return;
  }

  fetch("http://localhost:5018/api/admin/users", {
      headers: {
          'Authorization': `Bearer ${token}`,  // Include token in Authorization header
          'Content-Type': 'application/json'
      }
  })
  .then((response) => {
      if (response.status === 401) {
          // If unauthorized, redirect to login
          window.location.href = '../login.html';
      }
      return response.json();
  })
  .then((data) => {
      const userTable = document.getElementById("user-list");
      userTable.innerHTML = "";
      data.forEach((user) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.role}</td>
              <td>
                  <button class="btn btn-sm btn-primary" onclick="editUser('${user.id}')">Edit</button>
                  <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
              </td>`;
          userTable.appendChild(row);
      });
  })
  .catch((error) => console.error("Error loading users:", error));
}

function deleteUser(userId) {
  const token = localStorage.getItem('token');
  
  fetch(`http://localhost:5018/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
          'Authorization': `Bearer ${token}`,  // Include token in Authorization header
          'Content-Type': 'application/json'
      }
  })
  .then(() => loadUsers())
  .catch((error) => console.error("Error deleting user:", error));
}

function editUser(userId) {
  // Implement edit functionality
  console.log(`Edit user with ID: ${userId}`);
}
