// note : this page is for both admin and superAdmin
// TODO : get just doctor/patient roles users in loadUsers() "should performed in backend by using from the token"
// TODO : check if we get the user role correctly from local storage in addValuetoSelectRole()
// TODO : call PUT - users/id in  editUser()
// TODO : call DELETE - users/id in  deleteUser()
document.addEventListener("DOMContentLoaded", function () {
  addModalConfig();
  editModalConfig();
  deleteModalConfig();
  loadUsers();
  addValuetoSelectRole();
});
function addValuetoSelectRole(){
  const rolesForAdmin = ["doctor", "patient"]
  const selectFields = document.querySelector("select.select-role");

  rolesForAdmin.forEach( role => {
    const option = document.createElement("option");
    option.value = role;
    option.innerText = role;
    selectFields.appendChild(option);
  });
}
function addModalConfig(){
  const addModal = document.getElementById("add-user-modal");
  addModal.addEventListener("show.bs.modal" , () =>  {
    document.getElementById("add-user-form").reset();
  })
}
function editModalConfig() {
  const editModal = document.getElementById("edit-user-modal");
  const editForm = document.getElementById("edit-user-form");
  editModal.addEventListener("show.bs.modal", (event) => {

    editForm.reset();

    const btn = event.relatedTarget; // Button that triggered the modal
    const userJson = btn.getAttribute("data-user"); // Get data-id from button
    const user = JSON.parse(userJson);

    const idField = document.getElementById("edit-user-id");
    idField.value = user.id;
    const roleField = document.getElementById("edit-user-role");
    roleField.value = user.role;
    const nameField = document.getElementById("edit-user-name");
    nameField.value = user.name;
    const emailField = document.getElementById("edit-user-email");
    emailField.value = user.email;
  });
}
function deleteModalConfig() {
  const deleteModal = document.getElementById("delete-user-modal");
  deleteModal.addEventListener("show.bs.modal", (event) => {
    const btn = event.relatedTarget; // Button that triggered the modal
    const userId = btn.getAttribute("data-id"); // Get data-id from button
    // Set the appointment id into the hidden field in the form
    const idField = document.getElementById("delete-user-id");
    idField.value = userId;
    console.log(userId)
  });
}
function addUser(){
  const form = document.getElementById("add-user-form");
  if(form.checkValidity()){
      const passwordField = document.getElementById('add-user-password');
      const confirmPasswordField = document.getElementById('add-user-confirm-password'); 
      if(passwordField.value !== confirmPasswordField.value){
        confirmPasswordField.value = "";
        form.checkValidity()
      } else {
        const user = {
          email : document.getElementById("add-user-email").value ,
          name : document.getElementById("add-user-name").value,
          password : document.getElementById("add-user-password").value,
          role : document.getElementById("add-user-role").value,
        };
      }
  }
}
function editUser() {
  const form = document.getElementById("edit-user-form");
  if(form.checkValidity()){
      const passwordField = document.getElementById('edit-user-password');
      const confirmPasswordField = document.getElementById('edit-user-confirm-password'); 
      if(passwordField.value !== confirmPasswordField.value){
        confirmPasswordField.value = "";
        form.checkValidity()
      } else {
        const id = document.getElementById("edit-user-id").value;
        const user = {
          email : document.getElementById("edit-user-email").value ,
          name : document.getElementById("edit-user-name").value,
          password : document.getElementById("edit-user-password").value,
          role : document.getElementById("edit-user-role").value,
        };
        console.log(user)
        // call edit endpoint
      }
  }
}
function deleteUser() {
  const id = document.getElementById("delete-user-id").value;
  console.log(id)
  
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
function loadUsers() {
  // Get the JWT token from localStorage
  const token = localStorage.getItem('token');
  
//   if (!token) {
//       console.error("No token found. Redirecting to login.");
//       window.location.href = '../login.html'; // Redirect to login if no token
//       return;
//   }
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
        const userJsonFormat = JSON.stringify(user);
        console.log(userJsonFormat);
        console.log(typeof userJsonFormat);
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.role}</td>
              <td>
                  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#edit-user-modal" data-user=${userJsonFormat}>Edit</button>
                  <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-user-modal" data-id="${user.id}">Delete</button>
              </td>`;
          userTable.appendChild(row);
      });
      showToast("users loaded" , true)
  })
  .catch((error) =>{ 
    showToast("fail to load users" , false);
    console.error("Error loading users:", error)});
}







    // Signup functionality
  //   document.getElementById('signupForm').addEventListener('submit', async function(event) {
  //     event.preventDefault();

  //     const name = document.getElementById('signupName').value;
  //     const email = document.getElementById('signupEmail').value;
  //     const password = document.getElementById('signupPassword').value;
  //     const confirmPassword = document.getElementById('signupConfirmPassword').value;
  //     const role = "Patient"; // Default role

  //     if (password !== confirmPassword) {
  //         document.getElementById('signupError').textContent = 'Passwords do not match!';
  //         return;
  //     }

  //     try {
  //         const response = await fetch(`${window.currentConfig.apiUrl}/api/account/register`, {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //                 UserName: name.replace(/\s+/g, '').toLowerCase(),
  //                 name,
  //                 email,
  //                 password,
  //                 confirmPassword,
  //                 role
  //             })
  //         });

  //         const data = await response.json();

  //         if (response.status === 409) {
  //             document.getElementById('signupError').textContent = 'User already registered with this email.';
  //         } else if (response.ok) {
  //             localStorage.setItem('userToken', data.token); // Store JWT token
  //             document.getElementById('signupError').textContent = '';
  //              // Use jwt-decode to decode token
  //              const decodedToken = jwt_decode(data.token);
  //              const userRole = decodedToken.role;// Ensure role is part of the token payload
  //              debugger 
  //             // Redirect based on role
  //             switch (userRole) {
  //                 case 'Patient':
  //                     window.location.href = '/Patientdashboard/patient-dashboard.html';
  //                     break;
  //                 case 'Doctor':
  //                     window.location.href = '/doctordash/doctor-dashboard.html';
  //                     break;
  //                 case 'Admin':
  //                     window.location.href = 'admindash/admin-dashboard.html';
  //                     break;
  //                 case 'SuperAdmin':
  //                     window.location.href = 'Superadmindash/superadmin-dashboard.html';
  //                     break;
  //                 default:
  //                     window.location.href = 'shared/profile.html'; // Default fallback
  //                     break;
  //             }
  //         } else {
  //             document.getElementById('signupError').textContent = data.message || 'Signup failed, try again.';
  //         }
  //     } catch (error) {
  //         document.getElementById('signupError').textContent = 'An error occurred. Please try again.';
  //     }
  // });