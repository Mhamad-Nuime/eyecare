let linksArray = [];

  function addLink(e){
    e.preventDefault();
    const textE = document.getElementById("link-text")
    const hrefE = document.getElementById("link-href")
    if(textE.value == "" || hrefE.value == "") return;
    let newLink = {
      text : textE.value,
      url : hrefE.value,
    }
    linksArray.push(newLink);
    //add new link to ul list 
    const linkLi = document.createElement("li");
    linkLi.classList.add("mx-3")
    linkLi.innerHTML = `
      <span class="me-2">${textE.value}  :</span><span>${hrefE.value}</span>
    `;
    const linksList = document.getElementById("links-list");
    linksList.appendChild(linkLi)
    textE.value = "";
    hrefE.value = "";
  }
  
  function saveFooter(event){
    event.preventDefault();

    const description = document.getElementById("footerDescription");
    const footerEmail = document.getElementById("footerEmail");
    const footerPhone = document.getElementById("footerPhone");

    const footerData = {  
      "description": description.value,
      "supportEmail": footerEmail.value,
      "supportPhone": footerPhone.value,
      "footerLinks": linksArray
    }
    fetch(`${window.currentEnv.apiUrl}/api/footer/settings`,{
      method : "POST",
      body : JSON.stringify(footerData),
      headers : {
        "Content-Type" : "application/json"
      }
    }).then(res => {
      description.value="";
      footerEmail.value="";
      footerPhone.value="";
      linksArray = [];
      document.getElementById("links-list").innerHTML = "";
      showToast("footer data get added successfully" , true);
    }).catch(err => {
      showToast("Something went Wrong while saving footer data " , false);
    })
  }