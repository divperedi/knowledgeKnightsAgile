import { fetchUser } from "./users.js";

const usernameSignup = document.getElementById('usernameSignup');
const emailSignup = document.getElementById('emailSignup');
const passwordSignup = document.getElementById('passwordSignup');
const password2Signup = document.getElementById('password2Signup');

document.addEventListener('DOMContentLoaded', () => {
const createAccount = document.getElementById('createAccount');

    createAccount.addEventListener('submit', e => {
    e.preventDefault();
    validateInputs();
    saveUserInfo();
    // window.location.href = '../Html/login.html';
    });
});

const setError = (element, message) => {
  const signupInputGroup = element.parentElement;
  const errorDisplay = signupInputGroup.querySelector('.error');

  errorDisplay.innerText = message;
  signupInputGroup.classList.add('error');
  signupInputGroup.classList.remove('success');
  element.value = '';
}

const setSuccess = element => {
  const signupInputGroup = element.parentElement;
  const errorDisplay = signupInputGroup.querySelector('.error');

  errorDisplay.innerText = '';
  signupInputGroup.classList.add('success');
  signupInputGroup.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email instanceof Element && email.value !== undefined) {
        return re.test(String(email.value).toLowerCase());
    } else {
        return re.test(String(email).toLowerCase());
    }
}

const saveUserInfo = async () => {
    const user = {
        username: usernameSignup.value.trim(),
        email: emailSignup.value.trim(),
        password: passwordSignup.value.trim(),
        password2: password2Signup.value.trim()
    }
    
    try {
        let users = await fetchUser();
        const userJSON = JSON.stringify(user);
        localStorage.setItem('user', userJSON);
        // window.location.href = '../Html/login.html';
        
        } catch (error) {
            console.error("error user save", error);
    }
}

const validateInputs = () => {
    const usernameSignupValue = usernameSignup.value.trim();
    const emailSignupValue = emailSignup.value.trim();
    const passwordSignupValue = passwordSignup.value.trim();
    const password2SignupValue = password2Signup.value.trim();

    if(usernameSignupValue === '') {
        setError(usernameSignup, 'Username is required');
    } else {
        setSuccess(usernameSignup);
    }

    if(emailSignupValue === '') {
        setError(emailSignup, 'Email is required');
    } else if (!isValidEmail(emailSignup)) {
        setError(emailSignup, 'Provide a valid email address');
    } else {
        setSuccess(emailSignup);
    }

    if(passwordSignupValue === '') {
        setError(passwordSignup, 'password is required');
    } else if (passwordSignupValue.length < 8 ) {
        setError(passwordSignup, 'Password must be at least 8 character.');
    } else {
        setSuccess(passwordSignup);
    }

    if (password2SignupValue === '') {
        setError(password2Signup, 'Please confirm your password');
    } else if (password2SignupValue !== passwordSignupValue) {
        setError(password2Signup, "Passwords doesn't match");
    } else {
        setSuccess(password2Signup);
    }
};

export { setError, setSuccess, isValidEmail, validateInputs }