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
const corsHeader = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': 'http://127.0.0.1:5500',
  'Access-Control-Allow-Credentials': 'true'
}
window.corsHeaders = corsHeader;
window.currentConfig = config[currentEnv];