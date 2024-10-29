function loadFooterContent() {
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

            document.getElementById('footer-description').textContent = footerData.description

            // Dynamic department list
            const supportLinks = document.getElementById('footer-support-links');
            supportLinks.innerHTML = '';

            // Access $values inside footerLinks
            const footerLinksArray = footerData.footerLinks.$values;

            if (Array.isArray(footerLinksArray)) {
                footerLinksArray.forEach(link => {
                    const listItem = document.createElement('li');
                    const linkElement = document.createElement('a');
                    linkElement.href = link.url || "#";
                    linkElement.textContent = link.text || "Not Available";
                    listItem.appendChild(linkElement);
                    supportLinks.appendChild(listItem);
                });
            } else {
                console.error('Unexpected footerLinks data format:', data.footerLinks);
            }

            document.getElementById('footer-phone').textContent = footerData.supportPhone || "Not Available";
            document.getElementById('footer-phone').href = `tel:${footerData.supportPhone}` || "#";
            document.getElementById('footer-email').textContent = footerData.supportEmail || "Not Available";
            document.getElementById('footer-email').href = `mailto:${footerData.supportEmail}` || "";
        })
        .catch(error => console.error('Error fetching contact info:', error));
}
