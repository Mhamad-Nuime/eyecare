document.addEventListener("DOMContentLoaded", function () {
    fetchHeaderContactInfo();
    googleTranslateElementInit();
});
function fetchHeaderContactInfo() {
    fetch(`${window.currentConfig.apiUrl}/api/admin/footer`,{
        // headers : window.corsHeaders
        mode : 'no-cors'
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.getElementById('email').textContent = data.SupportEmail || "Not Available";
                document.getElementById('address').textContent = data.Description || "Not Available";
                document.getElementById('phone').textContent = data.SupportPhone || "Not Available";
            } else {
                console.error('No data received');
            }
        })
        .catch(error => console.error('Error fetching contact info:', error));
}
function googleTranslateElementInit() {
    if (typeof google !== 'undefined') {
        new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
    } else {
        console.error('Google Translate script failed to load.');
    }
}
