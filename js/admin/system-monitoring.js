document.addEventListener("DOMContentLoaded", function () {
    loadSystemLogs();
  });
  
  function loadSystemLogs() {
    fetch(`${window.currentConfig.apiUrl}/api/admin/system-logs`)
      .then((response) => response.json())
      .then((data) => {
        const logTable = document.getElementById("system-log-list");
        logTable.innerHTML = "";
        data.forEach((log) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${log.user}</td>
            <td>${log.activeSessions}</td>
            <td>${log.logs}</td>`;
          logTable.appendChild(row);
        });
      })
      .catch((error) => console.error("Error loading system logs:", error));
  }
  