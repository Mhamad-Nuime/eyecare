document.addEventListener("DOMContentLoaded", function () {
  deleteModalConfig()
  addModalConfig()
  loadFeedback();
  });
  
  function addModalConfig() {
    const addModal = document.getElementById("add-feedback-modal");
    addModal.addEventListener("show.bs.modal", (event) => {
      const form = document.getElementById("add-feedback-form");
      form.reset();
    });
  }
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


  async function loadFeedback(){
    const feedbackList = document.getElementById("feedback-list");
    feedbackList.innerHTML = "";
    fetch(`${window.currentEnv.apiUrl}/api/feedback`)
    .then(res => res.json())
    .then(res => {
        res.$values.forEach(async (feedback) => {
              const response = await fetch(`${window.currentEnv.apiUrl}/api/users/${feedback?.userId}`)
              const user = response.json() || ""
              const tr = document.createElement("tr")
              tr.innerHTML = `
              <td>${user.name || "UnKnown"}</td>
              <td>${user.email || "UnKnown"}</td>
              <td>${feedback.message}</td>
              <td><button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-feedback-modal" data-id="${feedback.id}">Delete</button></td>
              `;
              feedbackList.appendChild(tr);
            });
          });
          showToast("Feedbacks loaded successfully", true);
}
  
  function addFeedback() {
    const message = document.getElementById("message").value;
    const responseText = document.getElementById("responseText").value;

    //get user id 
    const userDataJson = localStorage.getItem("user");
    const userData = JSON.parse(userDataJson);
    const userId =  "";

    let feedbackData = {
      userId : userId,
      message : message,
      responseText : responseText
    }

    fetch(`${window.currentConfig.apiUrl}/api/feedback`, {
      method: "POST",
      body : JSON.stringify(feedbackData),
    }).then(() => {
        showToast("Created", true);
        loadFeedback()}).catch((error) => {
        showToast("Not Created", false)
        console.error("Error creating feedback:", error)});
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