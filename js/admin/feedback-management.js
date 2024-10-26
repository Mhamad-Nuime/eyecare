document.addEventListener("DOMContentLoaded", function () {
  deleteModalConfig()
  loadTestimonial();
  });
  
  function deleteModalConfig() {
    const deleteModal = document.getElementById("delete-feedback-modal");
    deleteModal.addEventListener("show.bs.modal", (event) => {
      const btn = event.relatedTarget; // Button that triggered the modal
      const feedbackId = btn.getAttribute("data-id"); // Get data-id from button
      // Set the appointment id into the hidden field in the form
      const idField = document.getElementById("delete-feedback-id");
      idField.value = feedbackId;
    });
  }


  async function loadTestimonial(){
    const feedbackList = document.getElementById("feedback-list");
    fetch(`${window.currentEnv.apiUrl}/api/feedback`)
    .then(res => res.json())
    .then(res => {
        res.$values.forEach(async (feedback) => {
            fetch(`${window.currentEnv.apiUrl}/api/users/${feedback?.userId}`)
            .then(res => res.json())
            .then(res => {
                const user = res;
                if(user){
                    const tr = document.createElement("tr")
                    tr.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${feedback.message}</td>
                    <td><button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-feedback-modal" data-id="${feedback.id}">Delete</button></td>
                    `;
                    feedbackList.appendChild(tr);
                }

            })
        })
    })
}
  
  function deleteFeedback() {
    const id = document.getElementById("delete-feedback-id").value;
    debugger;
    fetch(`${window.currentConfig.apiUrl}/api/feedback/${id}`, {
      method: "DELETE",
    }).then(() => {
        showToast("Deleted", true);
        loadFeedback()}).catch((error) => {
        showToast("Not Deleted", false)
        console.error("Error deleting feedback:", error)});
  }
  