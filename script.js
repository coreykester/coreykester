// Simple client-side login/signup using localStorage
// - Sign up stores username/email/password in localStorage (per-user browser)
// - Login checks stored credentials and redirects to dashboard

function getBasePath() {
  const path = window.location.pathname;
  return path.includes('/coreykester.com/') ? '/coreykester.com/' : './';
}

function initApp() {
  const loginForm = document.querySelector('form');
  const signupLink = document.querySelector('.signup-link a');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!username || !password) {
        alert('Please fill in all fields');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u) => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('currentUser', username);
        window.location.href = getBasePath() + 'dashboard.html';
      } else {
        alert('Invalid username or password');
      }
    });
  }

  if (signupLink) {
    signupLink.addEventListener('click', function (e) {
      e.preventDefault();
      showSignupForm();
    });
  }
}

function showSignupForm() {
  const loginBox = document.querySelector('.login-box');
  loginBox.innerHTML = `
    <h2>Sign Up</h2>
    <form id="signupForm">
      <div class="form-group">
        <label for="signup-username">Username</label>
        <input type="text" id="signup-username" required minlength="3">
      </div>
      <div class="form-group">
        <label for="signup-email">Email</label>
        <input type="email" id="signup-email" required>
      </div>
      <div class="form-group">
        <label for="signup-password">Password</label>
        <input type="password" id="signup-password" required minlength="6">
      </div>
      <div class="form-group">
        <label for="signup-confirm">Confirm Password</label>
        <input type="password" id="signup-confirm" required minlength="6">
      </div>
      <button type="submit" class="login-button">Create account</button>
    </form>
    <p class="signup-link">Already have an account? <a href="#" id="backToLogin">Login here</a></p>
  `;

  document.getElementById('backToLogin').addEventListener('click', function (e) {
    e.preventDefault();
    location.reload();
  });

  document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;

    if (!username || !email || !password || !confirm) {
      alert('Please fill in all fields');
      return;
    }
    if (username.length < 3) {
      alert('Username must be at least 3 characters');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u) => u.username === username)) {
      alert('Username already exists');
      return;
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created! You can now login.');
    location.reload();
  });
}

window.addEventListener('DOMContentLoaded', initApp);
