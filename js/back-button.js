// Ensure the DOM is fully loaded before creating the button
document.addEventListener('DOMContentLoaded', function() {
  // Add Bootstrap Icons CSS to the page
  const bootstrapIconsLink = document.createElement('link');
  bootstrapIconsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css';
  bootstrapIconsLink.rel = 'stylesheet';
  document.head.appendChild(bootstrapIconsLink);

  // Create a button element
  const backButton = document.createElement('button');

  // Set the button's inner HTML to include the icon and text
  backButton.innerHTML = '<i class="bi bi-arrow-left"></i> Back';

  // Add Bootstrap classes to style and position the button
  backButton.classList.add('btn', 'btn-dark', 'position-fixed', 'm-3');

  // Set custom top value (30%)
  backButton.style.top = '15%';
  backButton.style.start = '40px';

  // Add an event listener to handle the click event
  backButton.addEventListener('click', function() {
    window.history.back();  // Go back to the previous page
  });

  // Append the button to the body (or any other container)
  document.body.appendChild(backButton);
});
