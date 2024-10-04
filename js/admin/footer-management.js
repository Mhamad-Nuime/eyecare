document.addEventListener("DOMContentLoaded", function () {
    loadFooterContent();
    document.getElementById("footerForm").addEventListener("submit", updateFooter);
  });
  
  function loadFooterContent() {
    fetch("http://localhost:5018/api/admin/footer")
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("footerDescription").value = data.description;
        document.getElementById("footerDepartments").value = data.departments.join(", ");
        document.getElementById("footerLinks").value = data.links.join(", ");
      })
      .catch((error) => console.error("Error loading footer content:", error));
  }
  
  function updateFooter(event) {
    event.preventDefault();
    const updatedData = {
      description: document.getElementById("footerDescription").value,
      departments: document.getElementById("footerDepartments").value.split(","),
      links: document.getElementById("footerLinks").value.split(","),
    };
  
    fetch("http://localhost:5018/api/admin/footer", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then(() => alert("Footer updated successfully"))
      .catch((error) => console.error("Error updating footer:", error));
  }
  