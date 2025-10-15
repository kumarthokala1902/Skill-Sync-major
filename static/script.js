document.addEventListener("DOMContentLoaded", () => {

  // ===== Logo redirect =====
  const logo = document.getElementById("logo");
  logo.addEventListener("click", () => window.location.href = "/");

  // ===== AI Assistant =====
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

    function setStatus(t){ status.textContent = t || ''; }

    toggle.addEventListener('click', () => {
      box.classList.toggle('open');
      const open = box.classList.contains('open');
      box.setAttribute('aria-hidden', !open);
      toggle.style.transform = open ? "rotate(0deg) translateX(15px) translateY(-30px)" : "rotate(0deg) translateX(0) translateY(0)";
      if(open && messages.children.length === 0) addMsg("Hi! I'm SkillSync Assistant — how can I help?");
    });

    closeBtn.addEventListener('click', () => {
      box.classList.remove('open');
      box.setAttribute('aria-hidden', 'true');
      toggle.style.transform = "rotate(0deg) translateX(0) translateY(0)";
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const text = input.value.trim();
      if(!text) return;
      addMsg(text, 'user');
      input.value = '';
      setStatus('Thinking...');
      try {
        const res = await fetch('/api/help_chat', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({message: text})
        });
        if(!res.ok) throw new Error('Server error');
        const data = await res.json();
        addMsg(data?.reply || "Hmm, I didn't get that — try again or ask differently.", 'bot');
      } catch(err){
        console.error(err);
        addMsg('Sorry for inconvenience the backend server is still in development phase. Nooo worries it will be getting ready soon.', 'bot');
      } finally { setStatus(''); }
    });
  })();

  // ===== Profile dropdown & auth =====
  const profileDropdown = document.querySelector('.profile-dropdown');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const signinBtn = document.querySelector('.signin-btn');
  const signupBtn = document.querySelector('.signup-btn');
  const usernameDisplay = document.querySelector('.username');
  const authModal = document.getElementById("auth-modal");
  const closeModal = document.querySelector(".close-modal");
  const switchLink = document.getElementById("switch-link");
  const authTitle = document.getElementById("auth-title");

  if(profileDropdown){
    profileDropdown.addEventListener('click', () => {
      dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  function showProfile(username, profileImg){
    signinBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    profileDropdown.style.display = 'flex';
    usernameDisplay.textContent = username;
    document.querySelector('.profile-icon').src = profileImg;
  }

  function openAuth(mode){ authModal.style.display = "block"; authTitle.textContent = mode; }

  signinBtn.addEventListener("click", () => openAuth("Sign In"));
  signupBtn.addEventListener("click", () => openAuth("Sign Up"));
  closeModal.addEventListener("click", () => authModal.style.display = "none");
  switchLink.addEventListener("click", () => openAuth(authTitle.textContent === "Sign In" ? "Sign Up" : "Sign In"));

  // ===== Submit login/sign-up =====
  document.getElementById("auth-submit").addEventListener("click", () => {
    const firstName = document.getElementById("First-input").value.trim() || "User";
    const secondName = document.getElementById("Second-input").value.trim() || "";
    const role = document.querySelector('input[name="role"]:checked').value;
    const username = firstName + " " + secondName;

    if(!firstName) { alert("Please enter your first name."); return; }

    authModal.style.display = "none";
    showProfile(username, "https://randomuser.me/api/portraits/men/1.jpg");

    // Dashboard container
    let dashboard = document.querySelector(".dashboard");
    if(!dashboard) {
      dashboard = document.createElement("section");
      dashboard.className = "dashboard";
      document.body.appendChild(dashboard);
    }

    // Remove previous mentor profile if exists
    const oldProfile = document.querySelector(".mentor-profile");
    if(oldProfile) oldProfile.remove();

    // Add mentor profile dynamically
    const mentorProfile = document.createElement("div");
    mentorProfile.className = "mentor-profile";
    mentorProfile.innerHTML = `
      <h3 id="mentor-name">${role === "Mentor" ? "Alice Sharma" : "John Doe"}</h3>
      <p><strong>Expertise:</strong> Frontend Development, React.js</p>
      <p><strong>Experience:</strong> 5 years in web development</p>
      <p><strong>Courses Mentored:</strong> Frontend Development Bootcamp</p>
      <p><strong>Availability:</strong> Mon-Wed, 3 PM - 6 PM IST</p>
    `;
    dashboard.appendChild(mentorProfile);
    dashboard.style.display = "flex";
  });

  // ===== Logout =====
  document.getElementById("logout-btn").addEventListener("click", () => {
    const dashboard = document.querySelector(".dashboard");
    if(dashboard) dashboard.style.display = "none";
    profileDropdown.style.display = "none";
    signinBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
  });

});




