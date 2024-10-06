document.addEventListener("DOMContentLoaded", function () {
    loadFeedback();
  });
  
  function loadFeedback() {
    fetch(`${window.currentConfig.apiUrl}/api/admin/feedback`)
      .then((response) => response.json())
      .then((data) => {
        const feedbackTable = document.getElementById("feedback-list");
        feedbackTable.innerHTML = "";
        data.$values.forEach((feedback) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${feedback?.name || "N/A"}</td>
            <td>${feedback?.email || "N/A"}</td>
            <td>${feedback?.message || "N/A"}</td>
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
  