document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetchActiveSessions(token);
    fetchSystemLogs(token);

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

function fetchActiveSessions(token) {
    fetch('http://localhost:7276/api/admin/sessions', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const sessionList = document.getElementById('sessionList');
        sessionList.innerHTML = '';

        data.forEach(session => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Session ID: ${session.id} - User: ${session.userName}`;

            const terminateBtn = document.createElement('button');
            terminateBtn.className = 'btn btn-sm btn-danger float-right';
            terminateBtn.textContent = 'Terminate';
            terminateBtn.addEventListener('click', () => terminateSession(token, session.id));

            listItem.appendChild(terminateBtn);
            sessionList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching active sessions:', error);
    });
}

function terminateSession(token, sessionId) {
    fetch(`http://localhost:7276/api/admin/sessions/${sessionId}/terminate`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            fetchActiveSessions(token);
            alert('Session terminated successfully!');
        } else {
            alert('Failed to terminate session.');
        }
    })
    .catch(error => {
        console.error('Error terminating session:', error);
    });
}

function fetchSystemLogs(token) {
    fetch('http://localhost:7276/api/admin/logs', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const logList = document.getElementById('logList');
        logList.innerHTML = '';

        data.forEach(log => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `${log.timestamp} - ${log.message}`;
            logList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching system logs:', error);
    });
}
