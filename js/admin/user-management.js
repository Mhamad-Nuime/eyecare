document.addEventListener("DOMContentLoaded", function () {
  loadUsers(undefined);
});
let arr = [];
function loadUsers(users = undefined) {
  // Get the JWT token from localStorage
  const token = localStorage.getItem('token');
  
//   if (!token) {
//       console.error("No token found. Redirecting to login.");
//       window.location.href = '../login.html'; // Redirect to login if no token
//       return;
//   }

  if(users){
    const userTable = document.getElementById("user-list");
      userTable.innerHTML = "";
      users.forEach((user) => {
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
  } else {
    fetch(`${window.currentConfig.apiUrl}/api/users/all`, {
      headers: {
        //   'Authorization': `Bearer ${token}`,  // Include token in Authorization header
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
      data.$values.forEach((user) => {
        window.users.push(user);
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
}

function deleteUser(userId) {
  // const token = localStorage.getItem('token');
  window.users = window.users.filter(user => user.id != userId)
  loadUsers(window.users);
  
  // fetch(`${window.currentConfig.apiUrl}/api/patient/${userId}`, {
  //     method: "DELETE",
  //     headers: {
  //           // Include token in Authorization header
  //         'Content-Type': 'application/json'
  //     }
  // })
  // .then(() => loadUsers())
  // .catch((error) => console.error("Error deleting user:", error.$values[0].description));
}

function editUser(userId) {
  const editWrapper = document.getElementById("edit-form");
  editWrapper.style.display = "block";
  const closeButton = document.getElementById("close");
  closeButton.addEventListener("click", () => {
    editWrapper.style.display = "none"
  });
  const form = document.getElementById("user-form");
  const nameField = document.getElementById("name").value;
  const currentPasswordField = document.getElementById("currentPassword").value;
  const newPasswordField = document.getElementById("newPassword").value;
  form.addEventListener("submit",
    (e) => {
      e.preventDefault();
      window.users = window.users.map(user => {
        if(user.id == userId){
          editWrapper.style.display = "none";
          return {...user, name: document.getElementById("name").value};
        } 
        else return user;
      })
      loadUsers(window.users)
  })
  // form.addEventListener("submit",
  //   () => {
  //   fetch(`${window.currentConfig.apiUrl}/api/patient/${userId}`,{
  //     method : "PUT",
  //     headers: {
  //       // 'Authorization': `Bearer ${token}`,  // Include token in Authorization header
  //       'Content-Type': 'application/json'
  //   },
  //     body : {
  //       "name": nameField,
  //       "email": emailField,
  //       "currentPassword": currentPasswordField,
  //       "newPassword": newPasswordField
  //     },
  //   })
  //   .then(()=>{
  //     editWrapper.style.display = "none";
  //     loadUsers();
  //   })
  //   .catch((error)=>{
  //     alert(error.$values[0].description);
  //   })
  // })

}
