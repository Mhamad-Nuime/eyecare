document.addEventListener('DOMContentLoaded', function () {
    checkUserLoggedIn();
  });
  
  function checkUserLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
      document.getElementById('username').textContent = user.name;
      document.getElementById('email').textContent = user.email;
      loadImage();
  } else {
      console.error('Error fetching profile:', error);
      showToast('Error fetching profile:', false);
  }

  }
  function previewImage(event) {
    const file = event.target.files[0];
    debugger;
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const profilePicture = document.getElementById('profilePicture');
        profilePicture.src = e.target.result; // Preview new image
      };
      reader.readAsDataURL(file);
    }
  }

  async function saveProfilePicture() {
    const files = document.getElementById("fileInput").files;
    if(!files){
      showToast("There is no image to upload !", false);
      return;
    }
    const dataForm = new FormData();
    dataForm.append("file", files[0]);
    let response = await fetch(`${window.currentEnv.apiUrl}/api/files/upload`,{
      method: "POST" ,
      body : dataForm,
    });
    const uploadData = await response.json();
    const imgUrl = `http://eyecare.somee.com/api/files/image/${uploadData.fileId}`;
    showToast("Image was uploaded successfully", true);
    const user = JSON.parse(localStorage.getItem("user"));
    let data = {profileImageUrl : imgUrl, userId : user.id , address : "Berlien", phoneNumber : "+1999888777"};
    if(!user.userProfileId){
      
      let response2 = await  fetch(`${window.currentEnv.apiUrl}/api/UserProfile`,{
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(data)
      });
      let profileData = await response2.json();
      debugger;
      let response3 = await  fetch(`${window.currentEnv.apiUrl}/api/UserProfile/${user.id}/assign-profile/${profileData.userProfileId}`,{
        method : "POST",
      });
      showToast("Image uploading done" , true);
      loadImage();
    } else {
      let response2 = await  fetch(`${window.currentEnv.apiUrl}/api/UserProfile`,{
        method : "PUT",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(data)
      });
      let profileData = await response2.json();
      showToast("Image uploading done" , true);
      loadImage();
    }
  }
  // async function saveProfilePicture() {
  //   const files = document.getElementById("fileInput").files;
  //   if(!files){
  //     showToast("There is no image to upload !", false);
  //     return;
  //   }
  //   const dataForm = new FormData();
  //   dataForm.append("file", files[0]);
  //   fetch(`${window.currentEnv.apiUrl}/api/files/upload`,{
  //     method: "POST" ,
  //     body : dataForm,
  //   }).then( async (res) => res.json()).then(async (res) => {
  //     showToast("Image was uploaded successfully", true);
  //     const imgUrl = `http://eyecare.somee.com/api/files/image/${res.fileId}`;
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     debugger;
  //     if(!user.userProfileId){
  //       fetch(`${window.currentEnv.apiUrl}/api/UserProfile`,{
  //         method : "POST",
  //         body : JSON.parse({profileImageUrl : imgUrl, userId : user.id , address : "", phoneNumber : ""})
  //       }).then((res)=>res.json()).then((res)=>{
  //         debugger;
  //         showToast("Image uploading done" , true);
  //         loadImage();
  //       }).catch((err)=>{
  //         debugger;
  //         showToast("Image Uploading fail", false);
  //       })
  //     } else {
  //       fetch(`${window.currentEnv.apiUrl}/api/UserProfile`,{
  //         method : "PUT",
  //         body : JSON.parse({profileImageUrl : imgUrl, userId : user.id , address : "", phoneNumber : ""})
  //       }).then((res)=>res.json()).then((res)=>{
  //         debugger;
  //         showToast("Image uploading done" , true);
  //         loadImage();
  //       }).catch((err)=>{
  //         debugger;
  //         showToast("Image Uploading fail", false);
  //       })
  //     }
  //     debugger;
  //   }).catch(err => showToast("Image was not uploading ", false))
  //   }



    function loadImage(){
      fetch(`${window.currentEnv.apiUrl}/api/UserProfile`)
      .then(res => res.json())
      .then(res => {
        const user = JSON.parse(localStorage.getItem("user"));
        let imgUrl ;
        for(let profile of res.$values){
          if(profile.userId == user.id){
            imgUrl = profile.profileImageUrl;
            break;
          }
        }
        debugger;
        if(!imgUrl) return;
        const imgElement = document.getElementById("profilePicture")
        imgElement.src = imgUrl;
      }).catch((err) => {
        showToast("fail to find user profile image", false);
      })
    }