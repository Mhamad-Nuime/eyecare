let currentEnv = "development";
        const config = {
        development: {
            apiUrl: "http://eyecare.somee.com",
            debug: true,
        },
        production: {
            apiUrl: "https://api.example.com",
            debug: false,
        },
        };

let users = [];
let appointments = [];
let clinic = [];
let doctors = [];
window.users = users;
window.appointment = appointments;
window.clinic = clinic;
window.doctors =doctors;
window.currentEnv = config[currentEnv];
window.currentConfig = config[currentEnv];