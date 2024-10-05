document.addEventListener("DOMContentLoaded", function () {
    loadFeedback();
  });
  
  function loadFeedback() {
    fetch(`${window.currentConfig.apiUrl}/api/admin/feedback`)
      .then((response) => response.json())
      .then((data) => {
        const feedbackTable = document.getElementById("feedback-list");
        feedbackTable.innerHTML = "";
        data.forEach((feedback) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${feedback.name}</td>
            <td>${feedback.email}</td>
            <td>${feedback.message}</td>
            <td>
              <button class="btn btn-sm btn-danger" onclick="deleteFeedback('${feedback.id}')">Delete</button>
            </td>`;
          feedbackTable.appendChild(row);
        });
      })
      .catch((error) => console.error("Error loading feedback:", error));
  }
  
  function deleteFeedback(feedbackId) {
    fetch(`${window.currentConfig.apiUrl}/api/admin/feedback/${feedbackId}`, {
      method: "DELETE",
    })
      .then(() => loadFeedback())
      .catch((error) => console.error("Error deleting feedback:", error));
  }
  