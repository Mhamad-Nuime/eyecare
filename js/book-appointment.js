function bookAppointment(data) {
  
  return fetch(`${window.currentConfig.apiUrl}/api/appointments/book`, 
    {
      method : 'POST',
      body : data
    }
  );
}
function bookAppointmentWithToast(promise) {
  promise.then(() => {
    showToast("Appointment Created Successfully", true);
  })
  .catch(() => showToast("fail to create Appointment", false));
}