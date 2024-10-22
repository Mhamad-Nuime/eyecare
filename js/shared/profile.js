document.addEventListener('DOMContentLoaded', function () {
    checkUserLoggedIn();
  });
  
  function checkUserLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
      document.getElementById('username').textContent = user.name;
      document.getElementById('email').textContent = user.email;
  } else {
      console.error('Error fetching profile:', error);
      showToast('Error fetching profile:', false);
  }

  }
