document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetchFeedback(token);

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

function fetchFeedback(token) {
    fetch(`${window.currentEnv.apiUrl}/api/admin/feedback`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const feedbackList = document.getElementById('feedbackList');
        feedbackList.innerHTML = '';

        data.forEach(feedback => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Feedback from ${feedback.patientName}: ${feedback.content}`;

            const respondBtn = document.createElement('button');
            respondBtn.className = 'btn btn-sm btn-primary float-right';
            respondBtn.textContent = 'Respond';
            respondBtn.addEventListener('click', () => respondToFeedback(feedback.id));

            listItem.appendChild(respondBtn);
            feedbackList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching feedback:', error);
    });
}

function respondToFeedback(feedbackId) {
    $('#respondModal').modal('show');

    document.getElementById('respondForm').onsubmit = function(event) {
        event.preventDefault();
        const responseText = document.getElementById('responseText').value;
        const token = localStorage.getItem('token');

        fetch(`${window.currentEnv.apiUrl}/api/admin/feedback/${feedbackId}/respond`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ responseText })
        })
        .then(response => {
            if (response.ok) {
                $('#respondModal').modal('hide');
                fetchFeedback(token);
                alert('Response sent successfully!');
            } else {
                alert('Failed to send response.');
            }
        })
        .catch(error => {
            console.error('Error sending response:', error);
        });
    };
}
