document.addEventListener("DOMContentLoaded", function() {
    // Load services dynamically when the page is fully loaded
    fetchServices();
});

function fetchServices() {
    // Fetch services from the backend API
    fetch(`${window.currentEnv.apiUrl}/api/service`) // Update this URL with the actual API endpoint
        .then(response => response.json())
        .then(data => {
            const servicesList = document.getElementById('services-list');
            servicesList.innerHTML = ''; // Clear existing content

            // Access the $values array from the response
            if (data && data.$values) {
                data.$values.forEach(service => {
                    const serviceBlock = `
                        <div class="col-lg-4 col-md-6 col-sm-6">
                            <div class="service-block mb-5">
                                <img src="${service.serviceImageUrl || 'default-image-url.jpg'}" alt="${service.name}" class="img-fluid">
                                <div class="content">
                                    <h4 class="mt-4 mb-2 title-color">${service.name}</h4>
                                    <p class="mb-4">${service.description}</p>
                                </div>
                            </div>
                        </div>`;
                    servicesList.innerHTML += serviceBlock;
                });
            } else {
                console.error('No services found');
            }
        })
        .catch(error => console.error('Error fetching services:', error));
}
