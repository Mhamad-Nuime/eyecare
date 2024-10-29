document.addEventListener("DOMContentLoaded", function () {
    fetchWorkHours();
    fetchEmergencyContact();
    loadTestimonial()
    // Populate dropdowns
    populateDepartments();
    if(!localStorage.getItem("user")){
        const selectDoctor = document.getElementById("departmentSelect");
        selectDoctor.setAttribute("disabled", true);
        
    } else {
        const message = document.getElementById("needs-login");
        message.style.display = "none";
        loadAllClinics();
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


async function loadTestimonial(){
    const testimonilRef = document.getElementById("testimonial-container");
    fetch(`${window.currentEnv.apiUrl}/api/feedback`)
    .then(res => res.json())
    .then(res => {
        res.$values.forEach(async (feedback) => {
            fetch(`${window.currentEnv.apiUrl}/api/user/${feedback?.userId}`)
            .then(res => res.json())
            .then(res => {
                const userName = res.name;
                if(userName){
                    const testimonialMarkup = document.createElement("div")
                    testimonialMarkup.classList.add("testimonial-block");
                    testimonialMarkup.classList.add("style-2");
                    testimonialMarkup.classList.add("gray-bg");
                    const i = document.createElement("i")
                    i.classList.add("icofont-quote-right");
                    const thumb = document.createElement("div")
                    thumb.classList.add("testimonial-thumb");
                    const blankImg = document.createElement("img")
                    blankImg.src = "../images/blank-user.jpg";
                    blankImg.classList.add("img-fluid");
                    thumb.appendChild(blankImg);
                    const info = document.createElement("div")
                    info.classList.add("client-info");
                    const text = document.createElement("h4")
                    text.textContent = feedback?.responseText || "--";
                    const user_name = document.createElement("span")
                    user_name.textContent = userName || "";
                    const msg = document.createElement("p")
                    msg.textContent = feedback?.message || "..............";
                    info.appendChild(text);
                    info.appendChild(user_name);
                    info.appendChild(msg);
                    testimonialMarkup.appendChild(i);
                    testimonialMarkup.appendChild(thumb);
                    testimonialMarkup.appendChild(info);
                    testimonilRef.appendChild(testimonialMarkup);
                }

            })
        })
    })
}



    //create appointment
    function loadAllClinics(){
        fetch(`${window.currentConfig.apiUrl}/api/clinics`)
        .then(response => response.json())
        .then(data => {
            const clinicSelect = document.getElementById("clinicSelect");
            clinicSelect.innerHTML = `<option value="" disabled selected hidden>choose</option>`;
              data.$values.forEach( (clinic) => {
                const option = document.createElement("option");
                option.value = clinic.clinicId;
                option.textContent = clinic.name;
                clinicSelect.appendChild(option);
              });
              clinicSelect.addEventListener("change", (event) => {
                const doctorSelect = document.getElementById("doctorSelect");
                doctorSelect.disabled = false;
                const clinicSelect = document.getElementById("clinicSelect");
                loadDoctorsByClinicId(clinicSelect.value);
              })
              showToast("Clinics loaded successfull", true)
        })
        .catch(error => console.error("Error loading clinics:", error));
      }
    
      function loadDoctorsByClinicId(id){
        fetch(`${window.currentConfig.apiUrl}/api/clinics/${id}/doctors`)
                        .then(res => res.json())
                        .then(res => {
                             const doctorSelect = document.getElementById("doctorSelect");
                             doctorSelect.innerHTML = `<option value="" disabled selected hidden>choose</option>`;
                             if(res.$values.length > 0 ){
                               for(let doctor of res.$values){
                                  const option = document.createElement("option");
                                  option.value = doctor.id;
                                  option.textContent = doctor.name;
                                  doctorSelect.appendChild(option);
                                }
                                doctorSelect.addEventListener("change", (event) => {
                                  const doctorSelect = document.getElementById("doctorSelect");
                                  loadAvailabilities(id, doctorSelect.value);
                                });
                              } else {
                                const option = document.createElement("option");
                                option.value = "";
                                option.textContent = "no doctors assigned to this clinic";
                                doctorSelect.appendChild(option);
                                showToast("choose another clinic because there's no doctor available in selected clinic", false);
                            }
    
                        })
                        .catch(err => {
                            showToast("Something wrong happened while load doctors for this clinic", false);
                        })
      }
      function loadAvailabilities(clinicId , doctorId){
        fetch(`${window.currentConfig.apiUrl}/api/Doctor/${doctorId}/availability?clinicId=${clinicId}`)
        .then(res => res.json())
        .then(res => {
          let data = [];
          res.workingHours.$values.forEach((availability) => {
            let obj = {};
            let day = availability.day;
            let halfHours = [];
            availability.slots.$values.forEach((slot) => {
              halfHours.push(slot.startTime);
            });
            obj[`${day}`] = halfHours;
            data.push(obj);
          })
            document.getElementById("message").disabled = false;
            document.getElementById("patientName").disabled = false;
            document.getElementById("add-appointment-submit-button").disabled = false;
            document.getElementById("reset-btn").disabled = false;
            document.getElementById("patientPhone").disabled = false;

            const appointmentComponent = document.getElementById("appointment-booking");
            appointmentComponent.disabled = false;
            appointmentComponent.availability = data;
        })
        .catch(err => {
            showToast("Something wrong happened while load doctors for this clinic", false);
        })
      }
    
      function createAppointment(){
        const user = JSON.parse(localStorage.getItem("user"));
    
        let date = document.getElementById("appointment-booking").value;
        // Parse the start time and end time
        const startDate = new Date(date);
        const startTime = startDate.toTimeString().split(' ')[0]; 
    
        const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
        const endTime = endDate.toTimeString().split(' ')[0]; 
    
        const data = {
          clinicId : document.getElementById("clinicSelect").value,
          doctorId : document.getElementById("doctorSelect").value,
          patientId : user.id,
          appointmentDate : date,
          status : "active",
          startTime : startTime,
          endTime : endTime,
        }
      debugger;
      fetch(`${window.currentConfig.apiUrl}/api/Appointment`,{
        method : "POST",
        body : JSON.stringify(data),
        headers : {
          "Content-Type" : "application/json"
        }
      }).then(res => {
        getAppointment();
        showToast("appointment Booked successfully", true);
        document.getElementById("close-add-appointment-icon-button").click();
      }).catch(err => {
        showToast("Something wrong happened while Booking appointment", false);
      })
      }

      function reset(){
        const doctorSelect = document.getElementById("doctorSelect");
        doctorSelect.disabled = true;
        document.getElementById("message").disabled = false;
        document.getElementById("message").value = "";
        document.getElementById("patientName").disabled = true;
        document.getElementById("patientName").value = "";
        document.getElementById("add-appointment-submit-button").disabled = true;
        document.getElementById("reset-btn").disabled = true;
        document.getElementById("patientPhone").disabled = true;
        document.getElementById("patientPhone").value = "";
      }