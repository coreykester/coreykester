// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const signupLink = document.querySelector('.signup-link a');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('username', username);
                    alert('Login successful!');
                    window.location.href = '/dashboard.html';
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
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
                <input type="text" id="signup-username" name="username" required>
            </div>
            <div class="form-group">
                <label for="signup-email">Email</label>
                <input type="email" id="signup-email" name="email" required>
            </div>
            <div class="form-group">
                <label for="signup-password">Password</label>
                <input type="password" id="signup-password" name="password" required>
            </div>
            <div class="form-group">
                <label for="signup-confirm">Confirm Password</label>
                <input type="password" id="signup-confirm" name="confirm" required>
            </div>
            <button type="submit" class="login-button">Sign Up</button>
        </form>
        <p class="signup-link">Already have an account? <a href="#" onclick="location.reload()">Login here</a></p>
    `;
    
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        
        if (password !== confirm) {
            alert('Passwords do not match');
            return;
        }
        
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Account created successfully! Please login.');
                location.reload();
            } else {
                alert(data.message || 'Signup failed');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}
