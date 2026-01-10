// Simple in-browser authentication system for GitHub Pages
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const signupLink = document.querySelector('.signup-link a');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username);
            
            if (!user) {
                alert('Invalid username or password');
                return;
            }
            
            // Simple password check (in production, use proper hashing)
            if (user.password !== password) {
                alert('Invalid username or password');
                return;
            }
            
            // Set auth
            localStorage.setItem('authToken', 'token_' + Date.now());
            localStorage.setItem('username', username);
            alert('Login successful!');
            window.location.href = 'dashboard.html';
        });
    }
    
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSignupForm();
        });
    }
});

function showSignupForm() {
    const loginBox = document.querySelector('.login-box');
    loginBox.innerHTML = `
        <h2>Sign Up</h2>
        <form id="signupForm">
            <div class="form-group">
                <label for="signup-username">Username</label>
                <input type="text" id="signup-username" name="username" required minlength="3">
            </div>
            <div class="form-group">
                <label for="signup-email">Email</label>
                <input type="email" id="signup-email" name="email" required>
            </div>
            <div class="form-group">
                <label for="signup-password">Password</label>
                <input type="password" id="signup-password" name="password" required minlength="6">
            </div>
            <div class="form-group">
                <label for="signup-confirm">Confirm Password</label>
                <input type="password" id="signup-confirm" name="confirm" required minlength="6">
            </div>
            <button type="submit" class="login-button">Sign Up</button>
        </form>
        <p class="signup-link">Already have an account? <a href="#" onclick="location.reload()">Login here</a></p>
    `;
    
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        
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
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username exists
        if (users.find(u => u.username === username)) {
            alert('Username already exists');
            return;
        }
        
        // Add new user
        users.push({
            username,
            email,
            password, // Note: In production, hash this!
            createdAt: new Date().toISOString()
        });
        
        localStorage.setItem('users', JSON.stringify(users));
        alert('Account created successfully! Please login.');
        location.reload();
    });
}