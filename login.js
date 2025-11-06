// ==================== DOM Elements ====================
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const submitBtn = document.getElementById('submitBtn');
const btnLoader = document.getElementById('btnLoader');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');
const errorAlertText = document.getElementById('errorAlertText');
const rememberMeCheckbox = document.getElementById('rememberMe');

// ==================== Validation Utilities ====================
const validators = {
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
            return 'Email is required';
        }
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
        }
        return null;
    },
    
    password: (value) => {
        if (!value) {
            return 'Password is required';
        }
        if (value.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return null;
    }
};

// ==================== Form Validation Functions ====================
function showError(inputElement, errorElement, message) {
    inputElement.classList.add('invalid');
    errorElement.textContent = message;
    inputElement.setAttribute('aria-invalid', 'true');
}

function clearError(inputElement, errorElement) {
    inputElement.classList.remove('invalid');
    errorElement.textContent = '';
    inputElement.setAttribute('aria-invalid', 'false');
}

function validateField(inputElement, errorElement, validator) {
    const error = validator(inputElement.value);
    if (error) {
        showError(inputElement, errorElement, error);
        return false;
    } else {
        clearError(inputElement, errorElement);
        return true;
    }
}

function validateForm() {
    const isEmailValid = validateField(emailInput, emailError, validators.email);
    const isPasswordValid = validateField(passwordInput, passwordError, validators.password);
    return isEmailValid && isPasswordValid;
}

// ==================== Alert Functions ====================
function showAlert(type, message) {
    hideAlerts();
    
    if (type === 'success') {
        successAlert.style.display = 'flex';
    } else if (type === 'error') {
        errorAlertText.textContent = message;
        errorAlert.style.display = 'flex';
    }
}

function hideAlerts() {
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
}

// ==================== Password Toggle ====================
let passwordVisible = false;

togglePasswordBtn.addEventListener('click', () => {
    passwordVisible = !passwordVisible;
    passwordInput.type = passwordVisible ? 'text' : 'password';
    
    // Update aria-label for accessibility
    togglePasswordBtn.setAttribute(
        'aria-label', 
        passwordVisible ? 'Hide password' : 'Show password'
    );
    
    // Add visual feedback
    togglePasswordBtn.style.color = passwordVisible ? 'var(--primary-color)' : '';
});

// ==================== Real-time Validation ====================
emailInput.addEventListener('blur', () => {
    if (emailInput.value) {
        validateField(emailInput, emailError, validators.email);
    }
});

passwordInput.addEventListener('blur', () => {
    if (passwordInput.value) {
        validateField(passwordInput, passwordError, validators.password);
    }
});

// Clear errors on input
emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('invalid')) {
        clearError(emailInput, emailError);
    }
    hideAlerts();
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('invalid')) {
        clearError(passwordInput, passwordError);
    }
    hideAlerts();
});

// ==================== Security: Prevent Multiple Submissions ====================
let isSubmitting = false;

// ==================== Form Submission ====================
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) {
        return false;
    }
    
    hideAlerts();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form values
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox.checked;
    
    // Set submitting flag and show loading state
    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    try {
        // Simulate API call (replace with actual authentication)
        await simulateLogin(email, password, rememberMe);
        
        // Success
        showAlert('success', 'Login successful! Redirecting...');
        
        // Store remember me preference
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        // Simulate redirect after 1.5 seconds
        setTimeout(() => {
            console.log('Redirecting to dashboard...');
            // window.location.href = '/dashboard';
        }, 1500);
        
    } catch (error) {
        // Error handling - OWASP: Use generic error messages
        showAlert('error', error.message);
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
});

// ==================== Simulate Login (Replace with real API) ====================
async function simulateLogin(email, password, rememberMe) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Demo credentials (replace with actual authentication)
            const validEmail = 'demo@example.com';
            const validPassword = 'password123';
            
            if (email === validEmail && password === validPassword) {
                resolve({ success: true, user: { email } });
            } else {
                // OWASP Best Practice: Generic error message to prevent user enumeration
                reject(new Error('Invalid email or password.'));
            }
        }, 1500);
    });
}

// ==================== Remember Me Functionality ====================
window.addEventListener('DOMContentLoaded', () => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
    }
});

// ==================== Social Login Handlers ====================
const googleBtn = document.querySelector('.google-btn');
const githubBtn = document.querySelector('.github-btn');

googleBtn.addEventListener('click', () => {
    console.log('Google login initiated...');
    showAlert('error', 'Google login is not configured yet');
    // Implement Google OAuth flow
    // window.location.href = '/auth/google';
});

githubBtn.addEventListener('click', () => {
    console.log('GitHub login initiated...');
    showAlert('error', 'GitHub login is not configured yet');
    // Implement GitHub OAuth flow
    // window.location.href = '/auth/github';
});

// ==================== Forgot Password Handler ====================
const forgotLink = document.querySelector('.forgot-link');
forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Forgot password clicked');
    showAlert('error', 'Password reset functionality not implemented yet');
    // window.location.href = '/forgot-password';
});

// ==================== Sign Up Handler ====================
const signupLink = document.querySelector('.signup-link a');
signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Sign up clicked');
    // window.location.href = '/signup';
});

// ==================== Keyboard Shortcuts ====================
document.addEventListener('keydown', (e) => {
    // Submit form on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit'));
    }
});

// ==================== Console Welcome Message ====================
console.log('%c🚀 FAANG-Level Login Page', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%c✅ Following OWASP, WCAG & Industry Best Practices', 'color: #48bb78; font-size: 12px;');
console.log('%cDemo Credentials (Development Only):', 'color: #764ba2; font-size: 14px; font-weight: bold;');
console.log('Email: demo@example.com');
console.log('Password: password123');
console.log('%c⚠️ In production, never expose credentials!', 'color: #f56565; font-weight: bold;');
