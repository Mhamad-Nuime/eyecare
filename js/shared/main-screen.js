document.addEventListener("DOMContentLoaded", function () {
    fetchWorkHours();
    fetchEmergencyContact();
    // Populate dropdowns
    populateDepartments();
    if(!localStorage.getItem("user")){
        const selectDoctor = document.getElementById("departmentSelect");
        selectDoctor.setAttribute("disabled", true);
        
    } else {
        const message = document.getElementById("needs-login");
        debugger
        message.style.display = "none";
    }
    // form Submission event
    const appointmentForm = document.getElementById("book-appointment-form");
    appointmentForm.addEventListener("submit", function (event) { 
        event.preventDefault(); // Prevent the form from submitting immediately
        submitAppointmentForm();
    });
    // select department event
    const departmentSelect = document.getElementById("departmentSelect");
    departmentSelect.addEventListener("input" , (event) => {
        populateDoctors();
    })
    function populateDepartments() {
        fetch(`${window.currentEnv.apiUrl}/api/department`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const departmentSelect = document.getElementById('departmentSelect');
                
                // Access the $values array
                const departments = data.$values; // This is the array we need
    
                if (Array.isArray(departments)) {
                    departments.forEach(department => {
                        const option = document.createElement('option');
                        option.value = department.departmentId; // Use departmentId as the value
                        option.textContent = department.name; // Use department name for display
                        departmentSelect.appendChild(option);
                    });
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch(error => console.error('Error fetching departments:', error));
    }
    
    function populateDoctors() {
        fetch(`${window.currentEnv.apiUrl}/api/doctorprofile/getalldoctorprofiles`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const doctorSelect = document.getElementById('doctorSelect');
    
                // Access the $values array
                const doctors = data.$values; // Get the doctors array from $values
    
                if (Array.isArray(doctors)) {
                    doctors.forEach(doctor => {
                        const option = document.createElement('option');
                        option.value = doctor.id; // Use doctor id as the value
                        option.textContent = doctor.name; // Use doctor name for display
                        doctorSelect.appendChild(option);
                    });
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch(error => console.error('Error fetching doctors:', error));
    }
    

    function checkUserLoggedIn() {

        const user = localStorage.getItem("user");
        if(user) return true;
        else {
            return false;
        }
        // const token = localStorage.getItem('userToken');
        // if (!token) {
        //     return false; // No token, user is not logged in
        // }
    
        // try {
        //     // Decode the token to check its expiration
        //     const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Extract payload (second part of the token)
    
        //     // Check if token is expired
        //     const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        //     if (tokenPayload.exp && tokenPayload.exp < currentTime) {
        //         console.log('Token expired');
        //         return false;
        //     }
    
        //     return true; // Token is valid and not expired
        // } catch (error) {
        //     console.error('Error decoding token:', error);
        //     return false; // Token is invalid or corrupted
        // }
    }


    function submitAppointmentForm() {
        const formData = {
            departmentId: document.getElementById('departmentSelect').value,
            doctorId: document.getElementById('doctorSelect').value,
            appointmentDate: document.getElementById('appointmentDate').value,
            appointmentTime: document.getElementById('appointmentTime').value,
            patientName: document.getElementById('patientName').value,
            patientPhone: document.getElementById('patientPhone').value,
            message: document.getElementById('message').value,
        };
    
        fetch(`${window.currentEnv.apiUrl}/api/appointment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userToken')}` // Use actual token logic
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect to the confirmation page
                window.location.href = "../shared/confirmation.html"; // Update this path if necessary
            } else {
                alert('There was an error with your appointment. Please try again.');
            }
        })
        .catch(error => {
            console.error("Error booking appointment:", error);
            alert("There was an error booking the appointment. Please try again.");
        }); 
    }
});  
function fetchWorkHours() {
    fetch(`${window.currentEnv.apiUrl}/api/clinic-schedule/work-hours`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('work-hours').textContent = `${data.openTime} - ${data.closeTime} (${data.daysOpen})`;
        })
        .catch(error => console.error('Error fetching work hours:', error));
}
function fetchEmergencyContact() {
    fetch(`${window.currentEnv.apiUrl}/api/clinic-schedule/emergency-contact`)
    .then(response => response.text()) // Use text() if the response might not be valid JSON
    .then(data => {
        // Since we expect plain text, directly use it
        document.getElementById('emergency-phone').textContent = data;
    })
    .catch(error => console.error('Error fetching emergency contact:', error));
}


