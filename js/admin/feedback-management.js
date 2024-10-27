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
    .then(async (res) => {
      debugger;
        res.$values.forEach(async (feedback) => {
              if(!feedback?.userId) return;
              const response = await fetch(`${window.currentEnv.apiUrl}/api/user/${feedback?.userId}`)
              const user = await response.json() || "";
              const tr = document.createElement("tr")
              debugger;
              tr.innerHTML = `
              <td>${user.name || "UnKnown"}</td>
              <td>${user.email || "UnKnown"}</td>
              <td>${feedback.message}</td>
              <td><button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-feedback-modal" data-id="${feedback.id}">Delete</button></td>
              `;
              feedbackList.appendChild(tr);
            });
            showToast("Feedbacks loaded successfully", true);
          });
}
  
  function deleteFeedback() {
    const id = document.getElementById("delete-feedback-id").value;
    debugger;
    fetch(`${window.currentConfig.apiUrl}/api/feedback/${id}`, {
      method: "DELETE",
    }).then(() => {
      document.getElementById("delete-user-close").click();
        showToast("Deleted", true);
        loadFeedback()}).catch((error) => {
        showToast("Not Deleted", false)
        console.error("Error deleting feedback:", error)});
  }
  