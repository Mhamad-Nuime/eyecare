// Function to create and show a toast
function showToast(message, isSuccess = true) {
  // Create the toast container dynamically if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.classList.add('toast-container', 'position-fixed', 'end-0', 'p-3');
    toastContainer.style.top = "15%";
    toastContainer.style.zIndex = '1050'; // Ensure it's on top
    document.body.appendChild(toastContainer);
  }

  // Create the toast element
  const toastElement = document.createElement('div');
  toastElement.classList.add('toast', 'align-items-center', 'border-0'); 
  toastElement.setAttribute('role', 'alert');
  toastElement.setAttribute('aria-live', 'assertive');
  toastElement.setAttribute('aria-atomic', 'true');

  // Set the background color based on success or error
  const toastBgColor = isSuccess ? ['bg-success', 'text-white'] : ['bg-danger', 'text-white'];

  // Add each class to the toast element
  toastElement.classList.add(...toastBgColor);

  // Set the inner content of the toast
  toastElement.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 px-2" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  // Append the toast to the container
  toastContainer.appendChild(toastElement);

  // Show the toast using Bootstrap's JavaScript API
  const toast = new bootstrap.Toast(toastElement);
  toast.show();

  // Hide the toast after 3 seconds
  setTimeout(() => {
    toast.hide();
  }, 5000);

  // Remove from DOM when the toast is hidden
  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });

  // Hide the toast when the user clicks anywhere on the page
  // document.addEventListener('click', () => {
  //   toast.hide();
  // }, { once: true });
}
