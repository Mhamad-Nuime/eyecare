window.addEventListener("DOMContentLoaded", () => {
  
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault()
      event.stopPropagation()
      form.classList.add('was-validated')
    }, false)
  })

  const closeButtonn = document.querySelectorAll(".form-modal-close")
  Array.from(closeButtonn).forEach(btn => {
    btn.addEventListener('click', event => {
      const form = document.getElementById(event.currentTarget.getAttribute("data-form-id"));
      form.classList.remove('was-validated')
    })
  })
})