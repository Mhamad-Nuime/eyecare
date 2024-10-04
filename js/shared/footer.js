document.addEventListener("DOMContentLoaded", function () {
    loadFooterContent();
  });
  
  function loadFooterContent() {
    fetch(`${window.currentConfig.apiUrl}/api/admin/footer`,{
      mode: 'cors',
      credentials : 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          // Static content
          document.getElementById('footer-description').textContent = data.description || "Not Available";
  
          // Dynamic department list
          const supportLinks = document.getElementById('footer-support-links');
          supportLinks.innerHTML = '';
          data.footerLinks.forEach(link => {
            const listItem = document.createElement('li');
            const linkElement = document.createElement('a');
            linkElement.href = link.url || "#";
            linkElement.textContent = link.name || "Not Available";
            listItem.appendChild(linkElement);
            supportLinks.appendChild(listItem);
          });
  
          // Contact info
          document.getElementById('footer-phone').textContent = data.supportPhone || "Not Available";
          document.getElementById('footer-email').textContent = data.supportEmail || "Not Available";
        } else {
          console.error('No data received');
        }
      })
      .catch(error => console.error('Error loading footer content:', error));
  }
  