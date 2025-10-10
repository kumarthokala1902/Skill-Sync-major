
// code to redirect hte home page whend click on the logo.


document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("logo");

  logo.addEventListener("click", () => {
    // Redirect to homepage
    window.location.href = "/";
  });
});




(() => {
  const toggle = document.getElementById('assist-toggle');
  const box = document.getElementById('assist-box');
  const closeBtn = document.getElementById('assist-close');
  const form = document.getElementById('assist-form');
  const input = document.getElementById('assist-input');
  const messages = document.getElementById('assist-messages');
  const status = document.getElementById('assist-status');

  function addMsg(text, who='bot'){
    const div = document.createElement('div');
    div.className = 'msg-item ' + (who==='user' ? 'user-msg' : 'bot-msg');
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function setStatus(t){
    status.textContent = t || '';
  }

  // Toggle assistant open/close with slide
  toggle.addEventListener('click', () => {
    box.classList.toggle('open');
    const open = box.classList.contains('open');
    box.setAttribute('aria-hidden', !open);

    // Animate logo: rotate + move slightly
    toggle.style.transform = open
      ? "rotate(45deg) translateX(15px) translateY(-30px)"
      : "rotate(0deg) translateX(0) translateY(0)";

    if(open && messages.children.length === 0){
      addMsg("Hi! I'm SkillSync Assistant — how can I help?");
    }
  });

  closeBtn.addEventListener('click', () => {
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    toggle.style.transform = "rotate(0deg) translateX(0) translateY(0)";
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;

    addMsg(text, 'user');
    input.value = '';
    setStatus('Thinking...');

    try{
      const res = await fetch('/api/help_chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({message: text})
      });

      if(!res.ok) throw new Error('Server error');
      const data = await res.json();
      if(data?.reply) addMsg(data.reply, 'bot');
      else addMsg("Hmm, I didn't get that — try again or ask for a different angle.");
    }catch(err){
      console.error(err);
      addMsg('Network or server error. Try again later.');
    }finally{
      setStatus('');
    }
  });
})();


// profile sign in and sign up.

const profileDropdown = document.querySelector('.profile-dropdown');
const dropdownMenu = document.querySelector('.dropdown-menu');
const signinBtn = document.querySelector('.signin-btn');
const signupBtn = document.querySelector('.signup-btn');

// Toggle dropdown on profile click
if(profileDropdown){
    profileDropdown.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Example: After login, hide sign in / sign up buttons and show profile
function showProfile(username, profileImg) {
    signinBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    profileDropdown.style.display = 'flex';
    document.querySelector('.username').textContent = username;
    document.querySelector('.profile-icon').src = profileImg;
}

// Simulate user login (remove this in real backend)
setTimeout(() => {
    showProfile('Alice', 'https://randomuser.me/api/portraits/women/1.jpg');
}, 1000);
