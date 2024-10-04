document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetchFooterSettings(token);

    document.getElementById('footerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateFooterSettings(token);
    });

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

function fetchFooterSettings(token) {
    fetch('http://localhost:7276/api/admin/footer', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('footerDescription').value = data.description;
        document.getElementById('footerEmail').value = data.supportEmail;
        document.getElementById('footerPhone').value = data.supportPhone;
        document.getElementById('footerLinks').value = JSON.stringify(data.footerLinks, null, 2);
    })
    .catch(error => {
        console.error('Error fetching footer settings:', error);
    });
}

function updateFooterSettings(token) {
    const description = document.getElementById('footerDescription').value;
    const supportEmail = document.getElementById('footerEmail').value;
    const supportPhone = document.getElementById('footerPhone').value;
    const footerLinks = JSON.parse(document.getElementById('footerLinks').value);

    fetch('http://localhost:7276/api/admin/footer', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description, supportEmail, supportPhone, footerLinks })
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('updateMessage').textContent = 'Footer updated successfully!';
        } else {
            document.getElementById('updateMessage').textContent = 'Failed to update footer.';
        }
    })
    .catch(error => {
        console.error('Error updating footer settings:', error);
    });
}
