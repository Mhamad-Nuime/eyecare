// logout.js
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('token'); // Remove the JWT token
    window.location.href = 'login.html'; // Redirect to login
});
