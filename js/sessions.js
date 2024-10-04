async function storeSessionData(key, value) {
    const token = localStorage.getItem('token');

    await fetch(`http://localhost:7276/api/session/${key}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ value })
    });
}

async function retrieveSessionData(key) {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:7276/api/session/${key}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        return data.value;
    }

    return null;
}
