function googleTranslateElementInit() {
    if (typeof google !== 'undefined' && typeof google.translate !== 'undefined') {
        new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
    } else {
        console.error('Google Translate script failed to load.');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetchHeaderContactInfo();
    loadGoogleTranslate(); // Load Google Translate script dynamically
});


function fetchHeaderContactInfo() {
    fetch(`${window.currentConfig.apiUrl}/api/admin/footer`, {
        
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                console.log(data);
                
                // Update header contact info
                document.getElementById('email').innerText = data.supportEmail || "Not Available";
                document.getElementById('address').textContent = data.description || "Not Available";
                document.getElementById('phone').textContent = data.supportPhone || "Not Available";
            } else {
                console.error('No data received');
            }
        })
        .catch(error => console.error('Error fetching contact info:', error));
}

