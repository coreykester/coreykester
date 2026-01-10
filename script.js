let currentPage = 'login';

function initApp() {
    if (currentPage === 'login') {
        setupLogin();
    }
}

function setupLogin() {
    const form = document.querySelector('form');
    const signupBtn = document.querySelector('.signup-link a');
    
    form.onsubmit = (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', username);
            window.location.href = basePath + 'dashboard.html';
        } else {
            alert('Invalid username or password');
        }
    };
    
    signupBtn.onclick = (e) => {
        e.preventDefault();
        goToSignup();
    };
}

function goToSignup() {
    currentPage = 'signup';
    const loginBox = document.querySelector('.login-box');
    loginBox.innerHTML = `
        <h2>Sign Up</h2>
        <form onsubmit="handleSignup(event)">
            <div class="form-group">
                <label for="new-username">Username</label>
                <input type="text" id="new-username" required minlength="3">
            </div>
            <div class="form-group">
                <label for="new-email">Email</label>
                <input type="email" id="new-email" required>
            </div>
            <div class="form-group">
                <label for="new-password">Password</label>
                <input type="password" id="new-password" required minlength="6">
            </div>
            <div class="form-group">
                <label for="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" required minlength="6">
            </div>
            <button type="submit" class="login-button">Sign Up</button>
        </form>
        <p class="signup-link">Already have an account? <a href="#" onclick="goToLogin(); return false;">Login here</a></p>
    `;
}

function goToLogin() {
    currentPage = 'login';
    location.reload();
}

function handleSignup(e) {
    e.preventDefault();
    
    const username = document.getElementById('new-username').value.trim();
    const email = document.getElementById('new-email').value.trim();
    const password = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    
    if (!username || !email || !password || !confirmPassword) {
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
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.username === username)) {
        alert('Username already exists');
        return;
    }
    
    users.push({
        username,
        email,
        password
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created! Please login.');
    goToLogin();
}

window.addEventListener('DOMContentLoaded', initApp);