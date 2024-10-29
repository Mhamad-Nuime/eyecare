document.addEventListener('DOMContentLoaded', function() {
    fetchContactInfo();
  });
  
  function fetchContactInfo() {
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
            document.getElementById("contact-email").textContent = footerData.supportEmail;
            document.getElementById("contact-email").href = `mailto:${footerData.supportEmail}`;
            document.getElementById("contact-phone").textContent = footerData.supportPhone;
            document.getElementById("contact-phone").textContent = `tel:${footerData.supportPhone}`;
        })
        .catch(error => console.error('Error fetching contact info:', error));
  }
  