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
window.currentEnv = config[currentEnv];
window.currentConfig = config[currentEnv];