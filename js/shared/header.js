function googleTranslateElementInit() {
    if (typeof google !== 'undefined' && typeof google.translate !== 'undefined') {
        new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
    } else {
        console.error('Google Translate script failed to load.');
    }
}

function fetchHeaderContactInfo() {
    fetch(`${window.currentConfig.apiUrl}/api/footer/settings`, {
        
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(res => {
            if(res.$values && res.$values.length == 0){
                showToast("There is no any footer data" , false );
                return;
            }
            const footerData = res.$values[res.$values.length - 1];
            debugger;
            document.getElementById("email").textContent = footerData.supportEmail;
            document.getElementById("email").href = `mailto:${footerData.supportEmail}`;
            document.getElementById("phone").textContent = footerData.supportPhone;
            document.getElementById("phone").textContent = `tel:${footerData.supportPhone}`;
        })
        .catch(error => console.error('Error fetching contact info:', error));
}

