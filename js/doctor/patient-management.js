let attachmentUrl = ""; // Stores uploaded attachment URL
let userProfileImageUrl = ""; // Stores uploaded profile image URL

// Load all patients for the logged-in doctor
function loadPatients() {
    const doctorId = JSON.parse(localStorage.getItem("user")).id;
    fetch(`${window.currentConfig.apiUrl}/api/doctor/${doctorId}/patients`)
        .then(res => res.json())
        .then(data => renderPatients(data.$values))
        .catch(error => console.error("Error loading patients:", error));
}

// Render patients in the table
function renderPatients(data) {
    const tbody = $('#patientTable tbody');
    tbody.empty();

    data.forEach(patient => {
        const clinicName = patient.clinic?.name || "N/A";
        const row = $(`
            <tr class="patient-row" style="cursor: pointer;">
                <td>${patient.name}</td>
                <td>${patient.email}</td>
                <td>${clinicName}</td>
            </tr>
        `);
        row.on('click', () => viewPatientProfile(patient.id));
        tbody.append(row);
    });
}

// View Patient Profile
function viewPatientProfile(patientId) {
    fetch(`${window.currentConfig.apiUrl}/api/user/${patientId}`)
        .then(res => res.json())
        .then(patient => {
            $('#patientId').val(patient.id);
            $('#patientNameView').text(patient.name);
            $('#patientEmailView').text(patient.email);
            $('#patientPhoneView').text(patient.phone || 'N/A');

            loadMedicalProfile(patientId);
            loadUserProfile(patientId);
            $('#viewProfileModal').modal('show');
        })
        .catch(error => console.error("Error fetching patient profile:", error));
}

// Load Medical Profile by fetching the profile ID associated with the patient
function loadMedicalProfile(patientId) {
    fetch(`${window.currentConfig.apiUrl}/api/user/${patientId}`)
        .then(res => res.json())
        .then(patientData => {
            const medicalProfileId = patientData.medicalProfileId;
            if (medicalProfileId) {
                fetch(`${window.currentConfig.apiUrl}/api/MedicalProfile/${medicalProfileId}`)
                    .then(res => res.json())
                    .then(profile => {
                        $('#medicalProfileId').val(profile.medicalProfileId);
                        $('#medicalHistory').val(profile.medicalHistory);
                        $('#medications').val(profile.medications);
                        $('#allergies').val(profile.allergies);
                        $('#bloodType').val(profile.bloodType);
                        attachmentUrl = profile.attachmentUrl;

                        // Handle attachment preview
                        if (profile.attachmentUrl) {
                            const fileExtension = profile.attachmentUrl.split('.').pop().toLowerCase();
                            if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
                                $('#attachmentPreview').html(`<img src="${profile.attachmentUrl}" class="img-fluid" alt="Medical Attachment">`).show();
                            } else {
                                $('#attachmentPreview').html(`<a href="${profile.attachmentUrl}" target="_blank" class="btn btn-secondary">Download Attachment</a>`).show();
                            }
                            $('#deleteAttachment').show();
                        } else {
                            $('#attachmentPreview').hide();
                            $('#deleteAttachment').hide();
                        }
                    })
                    .catch(error => console.error("Error loading medical profile:", error));
            } else {
                clearMedicalProfileFields();
            }
        })
        .catch(error => console.error("Error retrieving patient data:", error));
}

function clearMedicalProfileFields() {
    $('#medicalProfileId').val('');
    $('#medicalHistory').val('');
    $('#medications').val('');
    $('#allergies').val('');
    $('#bloodType').val('');
    $('#attachmentPreview').hide();
    $('#deleteAttachment').hide();
}

// Upload Medical Attachment
$('#medicalAttachment').on('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        $('#saveMedicalProfileBtn').prop('disabled', true);
        uploadMedicalDocument(file).then(url => {
            if (url) {
                attachmentUrl = url;
                $('#medicalAttachmentLink').attr('href', url).show();
                $('#deleteAttachment').show();
            }
            $('#saveMedicalProfileBtn').prop('disabled', false);
        });
    }
});

function uploadMedicalDocument(file) {
    const formData = new FormData();
    formData.append("file", file);

    return fetch(`${window.currentConfig.apiUrl}/api/files/upload`, {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => `${window.currentConfig.apiUrl}/api/files/download/${data.fileId}`)
    .catch(error => {
        console.error("Error uploading file:", error);
        alert("File upload failed. Please try again.");
        return null;
    });
}

// Save Medical Profile and assign to patient
function saveMedicalProfile() {
    const profileData = {
        medicalProfileId: $('#medicalProfileId').val(),
        medicalHistory: $('#medicalHistory').val(),
        medications: $('#medications').val(),
        allergies: $('#allergies').val(),
        bloodType: $('#bloodType').val(),
        attachmentUrl: attachmentUrl,
        patientId: $('#patientId').val()
    };

    const method = profileData.medicalProfileId ? 'PUT' : 'POST';
    const url = `${window.currentConfig.apiUrl}/api/MedicalProfile`;

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
    })
    .then(response => response.json())
    .then(data => {
        alert("Medical profile saved successfully");
        const medicalProfileId = data.medicalProfileId || profileData.medicalProfileId;
        return fetch(`${window.currentConfig.apiUrl}/api/MedicalProfile/${profileData.patientId}/assign/${medicalProfileId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
    })
    .then(() => alert("Medical profile assigned to patient successfully"))
    .catch(error => console.error("Error in saving or assigning medical profile:", error));
}
// Load User Profile associated with the given patient ID
function loadUserProfile(patientId) {
    // Step 1: Fetch the user data associated with this patient
    fetch(`${window.currentConfig.apiUrl}/api/user/${patientId}`)
        .then(res => res.json())
        .then(user => {
            const userProfileId = user.userProfileId;

            // Step 2: If there's a user profile associated, fetch it
            if (userProfileId) {
                fetch(`${window.currentConfig.apiUrl}/api/UserProfile/${userProfileId}`)
                    .then(res => res.json())
                    .then(profile => {
                        // Step 3: Populate the profile data into the form fields
                        $('#userProfileId').val(profile.userProfileId);
                        $('#address').val(profile.address || '');
                        $('#phoneNumber').val(profile.phoneNumber || '');
                        
                        // Set the profile image if available
                        userProfileImageUrl = profile.profileImageUrl;
                        if (userProfileImageUrl) {
                            $('#profileImagePreview')
                                .html(`<img src="${userProfileImageUrl}" class="img-fluid rounded mt-2" alt="Profile Image">`)
                                .show();
                        } else {
                            $('#profileImagePreview').hide();
                        }
                    })
                    .catch(error => console.error("Error loading user profile:", error));
            } else {
                // If no profile ID exists, clear fields for a new profile creation
                clearUserProfileFields();
            }
        })
        .catch(error => console.error("Error retrieving user data:", error));
}

// Function to clear User Profile fields for a new profile
function clearUserProfileFields() {
    $('#userProfileId').val('');
    $('#address').val('');
    $('#phoneNumber').val('');
    $('#profileImagePreview').hide();
}

function clearUserProfileFields() {
    $('#userProfileId').val('');
    $('#address').val('');
    $('#phoneNumber').val('');
    $('#profileImagePreview').hide();
}

// Upload User Profile Image
$('#profileImageUpload').on('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        uploadUserProfileImage(file);
    }
});

function uploadUserProfileImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    return fetch(`${window.currentConfig.apiUrl}/api/files/upload`, {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        userProfileImageUrl = `${window.currentConfig.apiUrl}/api/files/download/${data.fileId}`;
        $('#profileImagePreview').html(`<img src="${userProfileImageUrl}" class="img-fluid rounded mt-2" alt="Profile Image">`);
        return userProfileImageUrl;
    })
    .catch(error => {
        console.error("Error uploading profile image:", error);
        alert("Profile image upload failed. Please try again.");
        return null;
    });
}

// Save User Profile and assign to patient
function saveUserProfile() {
    const profileData = {
       
        address: $('#address').val(),
        phoneNumber: $('#phoneNumber').val(),
        profileImageUrl: userProfileImageUrl,
        userId: $('#patientId').val()
    };

    const method = profileData.userProfileId ? 'PUT' : 'POST';
    const url = `${window.currentConfig.apiUrl}/api/UserProfile`;

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
    })
    .then(response => response.json())
    .then(data => {
        alert("User profile saved successfully");
        const userProfileId = data.userProfileId || profileData.userProfileId;
        return fetch(`${window.currentConfig.apiUrl}/api/UserProfile/${profileData.userId}/assign-profile/${userProfileId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
    })
    .then(() => alert("User profile assigned to patient successfully"))
    .catch(error => console.error("Error saving or assigning user profile:", error));
}

// Initialize loading patients on document ready
$(document).ready(function() {
    loadPatients();
});
