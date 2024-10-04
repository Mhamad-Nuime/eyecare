document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetchUsers(token);

    document.getElementById('userSearch').addEventListener('input', function() {
        fetchUsers(token);
    });

    document.getElementById('addUserBtn').addEventListener('click', function() {
        document.getElementById('userForm').reset();
        $('#userModal').modal('show');
    });

    document.getElementById('userForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const userId = document.getElementById('userId').value;
        if (userId) {
            updateUser(token, userId);
        } else {
            addUser(token);
        }
    });

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

function fetchUsers(token) {
    const searchQuery = document.getElementById('userSearch').value;

    fetch(`http://localhost:7276/api/admin/users?search=${searchQuery}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const userList = document.getElementById('userList');
        userList.innerHTML = '';

        data.forEach(user => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `${user.name} (${user.role}) - ${user.email}`;

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-warning float-right ml-2';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editUser(token, user.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-danger float-right';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteUser(token, user.id));

            listItem.appendChild(editBtn);
            listItem.appendChild(deleteBtn);
            userList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });
}

function addUser(token) {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('userRole').value;
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('userConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    fetch('http://localhost:7276/api/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ UserName: email.split('@')[0], name, email, role, password, confirmPassword })
    })
    .then(response => {
        if (response.ok) {
            $('#userModal').modal('hide');
            fetchUsers(token);
            alert('User added successfully!');
        } else {
            alert('Failed to add user.');
        }
    })
    .catch(error => {
        console.error('Error adding user:', error);
    });
}

function editUser(token, userId) {
    fetch(`http://localhost:7276/api/admin/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('userName').value = data.name;
        document.getElementById('userEmail').value = data.email;
        document.getElementById('userRole').value = data.role;
        document.getElementById('userPassword').value = '';
        document.getElementById('userConfirmPassword').value = '';

        $('#userModal').modal('show');

        document.getElementById('userForm').onsubmit = function(event) {
            event.preventDefault();
            updateUser(token, userId);
        };
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
    });
}

function updateUser(token, userId) {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('userRole').value;
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('userConfirmPassword').value;

    if (password && password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    fetch(`http://localhost:7276/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, role, password, confirmPassword })
    })
    .then(response => {
        if (response.ok) {
            $('#userModal').modal('hide');
            fetchUsers(token);
            alert('User updated successfully!');
        } else {
            alert('Failed to update user.');
        }
    })
    .catch(error => {
        console.error('Error updating user:', error);
    });
}

function deleteUser(token, userId) {
    fetch(`http://localhost:7276/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            fetchUsers(token);
            alert('User deleted successfully!');
        } else {
            alert('Failed to delete user.');
        }
    })
    .catch(error => {
        console.error('Error deleting user:', error);
    });
}
