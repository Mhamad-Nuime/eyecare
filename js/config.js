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
window.currentConfig = config[currentEnv];