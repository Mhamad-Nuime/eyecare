document.addEventListener("DOMContentLoaded", function() {
    // Load services dynamically when the page is fully loaded
    fetchServices();
});

function fetchServices() {
    // Fetch services from the backend API
    fetch('http://localhost:5018/api/service') // Update this URL with the actual API endpoint
        .then(response => response.json())
        .then(data => {
            const servicesList = document.getElementById('services-list');
            servicesList.innerHTML = ''; // Clear existing content

            data.forEach(service => {
                const serviceBlock = `
                    <div class="col-lg-4 col-md-6 col-sm-6">
                        <div class="service-block mb-5">
                            <img src="${service.imageUrl}" alt="${service.name}" class="img-fluid">
                            <div class="content">
                                <h4 class="mt-4 mb-2 title-color">${service.name}</h4>
                                <p class="mb-4">${service.description}</p>
                            </div>
                        </div>
                    </div>`;
                servicesList.innerHTML += serviceBlock;
            });
        })
        .catch(error => console.error('Error fetching services:', error));
}