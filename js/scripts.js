// scripts.js

document.addEventListener("DOMContentLoaded", function() {
    // Initialize and manage dynamic content on various pages

    // Example for fetching services on the index page:
    if (document.getElementById('services-list')) {
        fetchServices().then(services => {
            const servicesList = document.getElementById('services-list');
            servicesList.innerHTML = '';
            services.forEach(service => {
                const serviceItem = document.createElement('li');
                serviceItem.innerHTML = `<a href="service-single.html?id=${service.id}">${service.name}</a>`;
                servicesList.appendChild(serviceItem);
            });
        });
    }

    // Example for handling the appointment form on the appointment page:
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!isUserAuthenticated()) {
                window.location.href = '/login.html';
                return;
            }

            const appointmentData = {
                departmentId: document.getElementById('departmentSelect').value,
                doctorId: document.getElementById('doctorSelect').value,
                date: document.getElementById('appointmentDate').value,
                time: document.getElementById('appointmentTime').value,
                patientName: document.getElementById('patientName').value,
                patientPhone: document.getElementById('patientPhone').value,
                message: document.getElementById('message').value
            };

            bookAppointment(appointmentData).then(result => {
                alert(result.message || 'Appointment booked successfully!');
            });
        });
    }

    // Fetch and display footer content
    fetchFooterContent().then(content => {
        const footer = document.getElementById('footer-content');
        footer.innerHTML = content.html;
    });
});
