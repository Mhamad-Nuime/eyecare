;(function ($) {
    'use strict';

    // SCROLL TO TOP
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 70) {
            $('.backtop').addClass('reveal');
        } else {
            $('.backtop').removeClass('reveal');
        }
    });

    $('.portfolio-single-slider').slick({
        infinite: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2000
    });

    $('.clients-logo').slick({
        infinite: true,
        arrows: false,
        autoplay: true,
        slidesToShow: 6,
        slidesToScroll: 6,
        autoplaySpeed: 6000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 6,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    });

    $('.testimonial-wrap').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
        arrows: false,
        autoplay: true,
        vertical: true,
        verticalSwiping: true,
        autoplaySpeed: 6000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $('.testimonial-wrap-2').slick({
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 6000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    var map;

    function initialize() {
        var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(50.97797382271958, -114.107718560791)
            // styles: style_array_here
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    }

    var google_map_canvas = $('#map-canvas');

    if (google_map_canvas.length) {
        google.maps.event.addDomListener(window, 'load', initialize);
    }

    // Counter
    $('.counter-stat span').counterUp({
        delay: 10,
        time: 1000
    });

    // Shuffle js filter and masonry
    var Shuffle = window.Shuffle;
    var jQuery = window.jQuery;

    var myShuffle = new Shuffle(document.querySelector('.shuffle-wrapper'), {
        itemSelector: '.shuffle-item',
        buffer: 1
    });

    jQuery('input[name="shuffle-filter"]').on('change', function (evt) {
        var input = evt.currentTarget;
        if (input.checked) {
            myShuffle.filter(input.value);
        }
    });

})(jQuery);

document.addEventListener('DOMContentLoaded', function () {
    const languageSwitcher = document.getElementById('language-switcher');
    if (languageSwitcher) {
        languageSwitcher.addEventListener('change', function () {
            const selectedLanguage = languageSwitcher.value;
            loadLanguage(selectedLanguage);
        });
    }
    // Load default language
    loadLanguage('en');
});

function loadLanguage(language) {
    fetch(`lang/${language}.json`)
        .then(response => response.json())
        .then(data => {
            for (let key in data) {
                const element = document.getElementById(key);
                if (element) {
                    if (Array.isArray(data[key])) {
                        // Special case for schedules or other lists
                        element.innerHTML = data[key].map(item => `<li class="d-flex justify-content-between">${item.day} : <span>${item.time}</span></li>`).join('');
                    } else {
                        element.textContent = data[key];
                    }
                }
            }
        });
}
document.addEventListener('DOMContentLoaded', async () => {
    const profile = awaitfetchUserProfile();
    const dashboardContainer = document.getElementById('dashboardContainer');

    // Clear existing content
    dashboardContainer.innerHTML = "";

    // Role-based dashboard rendering
    if (profile.role === 'SuperAdmin') {
        dashboardContainer.innerHTML = `
            <h1>SuperAdmin Dashboard</h1>
            <section id="userManagement">
                <h2>Manage Users</h2>
                <button id="addUserButton" class="btn btn-primary">Add New User</button>
                <div id="userList" class="user-list"></div>
            </section>
            <section id="appointmentsManagement">
                <h2>Manage Appointments</h2>
                <div id="appointmentList" class="appointment-list"></div>
            </section>
            <section id="reportsSection">
                <h2>System Reports</h2>
                <div id="reports" class="reports"></div>
            </section>
        `;
        // Load user management data, appointments, etc.
    } else if (profile.role === 'Admin') {
        dashboardContainer.innerHTML = `
            <h1>Admin Dashboard</h1>
            <section id="doctorManagement">
                <h2>Manage Doctors</h2>
                <button id="addDoctorButton" class="btn btn-primary">Add New Doctor</button>
                <div id="doctorList" class="doctor-list"></div>
            </section>
            <section id="appointmentsManagement">
                <h2>Manage Appointments</h2>
                <div id="appointmentList" class="appointment-list"></div>
            </section>
        `;
    } else if (profile.role === 'Doctor') {
        dashboardContainer.innerHTML = `
            <h1>Doctor Dashboard</h1>
            <section id="upcomingAppointments">
                <h2>Your Upcoming Appointments</h2>
                <div id="doctorAppointmentList" class="appointment-list"></div>
            </section>
            <section id="patientList">
                <h2>Your Patients</h2>
                <div id="patientListContainer" class="patient-list"></div>
            </section>
        `;
    } else if (profile.role === 'Patient') {
        dashboardContainer.innerHTML = `
            <h1>Patient Dashboard</h1>
            <section id="myAppointments">
                <h2>My Appointments</h2>
                <div id="patientAppointmentList" class="appointment-list"></div>
            </section>
            <section id="feedbackSection">
                <h2>Provide Feedback</h2>
                <textarea id="feedbackText" class="form-control" placeholder="Write your feedback here"></textarea>
                <button id="submitFeedbackButton" class="btn btn-primary mt-2">Submit Feedback</button>
            </section>
        `;
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    // Populate department dropdown
    const departments = awaitfetchDepartments();
    const departmentSelect = document.getElementById('departmentSelect');
    departments.forEach(department => {
        const option = document.createElement('option');
        option.value = department.departmentId;
        option.text = department.name;
        departmentSelect.add(option);
    });

    // Populate doctor dropdown when a department is selected
    departmentSelect.addEventListener('change', async () => {
        const departmentId = departmentSelect.value;
        const doctors = awaitfetchDoctors(departmentId);
        const doctorSelect = document.getElementById('doctorSelect');
        doctorSelect.innerHTML = ""; // Clear previous options
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.doctorId;
            option.text = `${doctor.firstName}${doctor.lastName}`;
            doctorSelect.add(option);
        });
    });

    // Handle appointment form submission
    const appointmentForm = document.getElementById('appointmentForm');
    appointmentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const appointmentData = {
            departmentId: departmentSelect.value,
            doctorId: document.getElementById('doctorSelect').value,
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            patientName: document.getElementById('patientName').value,
            patientPhone: document.getElementById('patientPhone').value,
            message: document.getElementById('message').value
        };

        const result = awaitbookAppointment(appointmentData);
        alert(result.Message || 'Appointment booked successfully!');
    });
});

