document.addEventListener('DOMContentLoaded', function() {
    fetchContactInfo();
  
    // Submit form logic
    document.getElementById('contact-form').addEventListener('submit', function(event) {
      event.preventDefault();
      sendContactForm();
    });
  });
  
  function fetchContactInfo() {
    fetch(`${window.currentEnv.apiUrl}/api/admin/footer`) // Adjust to the correct API URL if needed
      .then(response => response.json())
      .then(data => {
        document.getElementById('contact_phone').textContent = data.SupportPhone || 'Not available';
        document.getElementById('contact_email').textContent = data.SupportEmail || 'Not available';
        document.getElementById('contact_location').textContent = data.Description || 'Not available';
      })
      .catch(error => console.error('Error fetching contact info:', error));
  }
  
  function sendContactForm() {
    const name = document.getElementById('name').value;
    const Email = document.getElementById('e1').value;
    const subject = document.getElementById('subject').value;
    const phone = document.getElementById('p1').value;
    const message = document.getElementById('message').value;debugger
  
    fetch(`${window.currentEnv.apiUrl}/api/message`, {
      method: 'POST',
      
      body: JSON.stringify({ name, Email, subject, phone, message }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.Message || 'Message sent successfully!');
      })
      .catch(error => console.error('Error sending contact form:', error));
  }
  