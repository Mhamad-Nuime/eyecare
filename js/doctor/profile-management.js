// /js/doctor/profile-management.js

$(document).ready(function() {
    loadProfile();

    // Form submission event
    $("#profileForm").on("submit", function(event) {
        event.preventDefault();
        updateProfile();
    });
});

function loadProfile() {
    $.ajax({
        url: `${window.currentEnv.apiUrl}/api/doctors/profile`, // Adjust the API URL based on your structure
        method: 'GET',
        success: function(doctor) {
            $('#doctorName').val(doctor.name);
            $('#doctorEmail').val(doctor.email);
            $('#doctorSpecialization').val(doctor.specialization);
        },
        error: function(error) {
            console.error("Error loading profile:", error);
        }
    });
}

function updateProfile() {
    const updatedProfile = {
        name: $('#doctorName').val(),
        email: $('#doctorEmail').val(),
        specialization: $('#doctorSpecialization').val()
    };

    $.ajax({
        url: `${window.currentEnv.apiUrl}/api/doctors/profile`, // Adjust the API URL based on your structure
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedProfile),
        success: function() {
            $('#successMessage').text("Profile updated successfully!").show();
            setTimeout(() => {
                $('#successMessage').hide();
            }, 3000);
        },
        error: function(error) {
            console.error("Error updating profile:", error);
        }
    });
}
