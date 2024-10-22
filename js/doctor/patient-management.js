$(document).ready(function() {
    let isEditMode = false; // To differentiate between add and edit mode

    // Load existing patients on page load
    loadPatients();
    deleteModalConfig();
    // Update modal for adding new patient
    function updateModalForAdd() {
        $('#addPatientModal .modal-title').text('Add Patient');
        $('#savePatientBtn').text('Add Patient');
        isEditMode = false;
        $('#patientId').val(''); // Clear hidden field
    }

    // Update modal for editing a patient
    function updateModalForEdit() {
        $('#addPatientModal .modal-title').text('Edit Patient');
        $('#savePatientBtn').text('Update Patient');
        isEditMode = true;
    }

    // Show modal with reset if not in edit mode
    $('#addPatientModal').on('show.bs.modal', function () {
        if (!isEditMode) {
            $('#addPatientForm')[0].reset(); // Reset form when adding new patient
            $('#patientId').val(''); // Clear hidden field
        }
    });

    // Form validation before submission
    function validatePatientForm() {
        const email = $('#patientEmail').val();
        const password = $('#patientPassword').val();

        if (!email.includes('@')) {
            alert('Please enter a valid email address.');
            return false;
        }
        if (password.length < 6) {
            alert('Password should be at least 6 characters long.');
            return false;
        }
        return true;
    }

    // Generalized error handler for AJAX calls
    function handleAjaxError(error, message) {
        console.error(message, error);
        const responseMessage = error.responseJSON?.message || 'An error occurred. Please try again.';
        showToast(`${message}: ${responseMessage}`, false)
    }

    // Handle the form submission to add or update a patient
    $('#addPatientForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        if (!validatePatientForm()) {
            return; // Exit if validation fails
        }

        const patientId = $('#patientId').val(); // Get patient ID (if updating)
        const formData = new FormData(this); // Use FormData to handle file uploads

        const url = patientId ? `${window.currentConfig.apiUrl}/api/patient/${patientId}/upload-medical-profile` : `${window.currentConfig.apiUrl}/api/patient`;
        const method = patientId ? 'PUT' : 'POST';

        $.ajax({
            url: url,
            method: method,
            processData: false,
            contentType: false,
            data: formData,
            success: function(response) {
                alert(isEditMode ? 'Patient updated successfully!' : 'Patient added successfully!');
                $('#addPatientModal').modal('hide'); // Hide the modal
                loadPatients(); // Reload the patient list
                $('#addPatientForm')[0].reset(); // Reset the form
            },
            error: function(error) {
                handleAjaxError(error, 'Error submitting form');
            }
        });
    });

    // Function to load existing patients
    function loadPatients() {
        fetch(`${window.currentConfig.apiUrl}/api/patient`)
        .then(res => res.json())
        .then(res => {
            debugger;
            showToast("Patients loaded successfully" ,true)
            renderPatients(res);
        })
        .catch((e) =>{
            showToast("Error while loading patients" ,false)
        })
    }

    // Function to render patients in the table
    function renderPatients(data) {
        const tbody = $('#patientTable tbody');
        debugger;
        tbody.empty(); // Clear existing patients

        data.$values.forEach(function(patient) {
            const medicalHistory = patient.medicalProfile ? patient.medicalProfile.medicalHistory : 'N/A';
            const row = `
                <tr>
                    <td>${patient.name}</td>
                    <td>${patient.email}</td>
                    <td>${medicalHistory}</td>
                    <td class="row w-100">
                        <button class="btn btn-info btn-sm col-6" onclick="editPatient('${patient.id}')">Edit</button>
                        <button class="btn btn-danger btn-sm col-6" data-bs-toggle="modal" data-bs-target="#delete-patient-modal" data-id="${patient.id}">Delete</button>
                        <button class="btn btn-primary btn-sm col-12 mt-1" onclick="viewMedicalProfile('${patient.id}')">View Profile</button>
                    </td>
                </tr>
            `;
            tbody.append(row); // Append new row to the table
        });
    }

    // Function to view patient's medical profile
    window.viewMedicalProfile = function(patientId) {
        $.ajax({
            url: `${window.currentConfig.apiUrl}/api/patient/${patientId}`, 
            method: 'GET',
            success: function(patient) {
                $('#patientNameView').text(patient.name);
                $('#patientEmailView').text(patient.email);
                $('#bloodTypeView').text(patient.medicalProfile?.bloodType || 'N/A');
                $('#allergiesView').text(patient.medicalProfile?.allergies || 'N/A');
                $('#medicalHistoryView').text(patient.medicalProfile?.medicalHistory || 'N/A');
                $('#medicationsView').text(patient.medicalProfile?.medications || 'N/A');
                $('#patientProfileImage').attr('src', patient.profileImage || '../images/default-profile.png');

                if (patient.medicalProfile?.attachment) {
                    $('#medicalAttachment').attr('href', patient.medicalProfile.attachment).show();
                } else {
                    $('#medicalAttachment').hide();
                }

                $('#viewProfileModal').modal('show');
            },
            error: function(error) {
                handleAjaxError(error, 'Error loading patient profile');
            }
        });
    };

    // Show modal in edit mode for a patient
    window.editPatient = function(patientId) {
        updateModalForEdit();

        $.ajax({
            url: `${window.currentConfig.apiUrl}/api/patient/${patientId}`, 
            method: 'GET',
            success: function(patient) {
                // Populate the form with patient data
                $('#patientName').val(patient.name);
                $('#patientEmail').val(patient.email);
                $('#patientPassword').val(patient.password); // Set password
                $('#medicalHistory').val(patient.medicalProfile?.medicalHistory || '');
                $('#medications').val(patient.medicalProfile?.medications || '');
                $('#allergies').val(patient.medicalProfile?.allergies || '');
                $('#bloodType').val(patient.medicalProfile?.bloodType || '');
                $('#patientId').val(patientId); // Store the ID for update
                $('#addPatientModal').modal('show');
            },
            error: function(error) {
                handleAjaxError(error, 'Error fetching patient details');
            }
        });
    };

    // Handle patient deletion
    // window.deletePatient = function(patientId) {
    //     if (confirm("Are you sure you want to delete this patient?")) {
    //         $.ajax({
    //             url: `${window.currentConfig.apiUrl}/api/patient/${patientId}`,
    //             method: 'DELETE',
    //             success: function() {
    //                 alert("Patient deleted successfully!");
    //                 loadPatients(); // Reload the patient list
    //             },
    //             error: function(error) {
    //                 handleAjaxError(error, 'Error deleting patient');
    //             }
    //         });
    //     }
    // };


    // Search functionality for filtering patients by name or email
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();

        $('#patientTable tbody tr').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(searchTerm) > -1);
        });
    });

    // Pagination handling using DataTables (if needed)
    // $('#patientTable').DataTable({
    //     paging: true,
    //     searching: false, // Disable built-in search for custom search input
    //     lengthMenu: [10, 25, 50, 100] // Customize page size
    // });
});
function deleteModalConfig() {
    const deleteModal = document.getElementById("delete-patient-modal");
    deleteModal.addEventListener("show.bs.modal", (event) => {
      const btn = event.relatedTarget; // Button that triggered the modal
      const userId = btn.getAttribute("data-id"); // Get data-id from button
      // Set the appointment id into the hidden field in the form
      const idField = document.getElementById("delete-patient-id");
      idField.value = userId;
    });
    const btn = document.getElementById("delete-patient-button");
    btn.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();
        deletePatient();
    })
  }

  function deletePatient(){
    const patientId = document.getElementById("delete-patient-id").value;
    fetch(`${window.currentConfig.apiUrl}/api/patient/${patientId}`, {
        method : "DELETE",
    }).then(res => {
        loadPatients();
        showToast("delete patient successfully", true)
    })
    .catch((e) => showToast("fail to delete patient", false))
}