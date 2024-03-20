// Validering för att logga in
import { fetchUser } from './users.js';

if (document.title === `Login`) {
    // Händelselyssnare på inloggningsknappen
    const loginBtnRef = document.querySelector(`#loginBtn`);
    loginBtnRef.addEventListener(`click`, (event) => {
        event.preventDefault();

        loginFunction();
    });
}



const loginFunction = async () => {

    const uName = document.querySelector(`#username-login`).value;
    const pWord = document.querySelector(`#password-login`).value;
    const errorMsg = document.querySelector(`.login__message--error`);

    const loginData = {
        username: uName,
        password: pWord
    };

    console.log(loginData.username, loginData.password);

    // Hämta användarlistan från API:et
    const users = await fetchUser();

    // Loopa igenom användarlistan och kontrollera inloggningsuppgifterna
    let userFound = false;

    for (let i = 0; i < users.length; i++) {
        // Hämta varje enskild användare i listan
        const user = users[i];
        if (user.username === loginData.username &&
            user.password === loginData.password) {
            // Sparar användarinformation i localStorage
            localStorage.setItem(`email`, user.email);
            localStorage.setItem(`profile_image`, user.profile_image);
            localStorage.setItem(`username`, user.username);
            localStorage.setItem(`role`, user.role);

            // Om användaren hittas, markera det och avsluta loopen
            userFound = true;
            break;
        }
    }

    try {

        if (uName === `` || pWord === ``) {
            // Visa felmeddelande till användaren
            throw { msg: 'Du måste fylla i båda fälten' }

        }
        else if (!userFound) {
            // Visa felmeddelande till användaren
            throw { msg: 'Fel användarnamn eller lösenord' }
        }
        else {
            // Om inloggningen lyckas, dirigera användaren till "profilepage.html"
            window.location.href = '../Html/profilepage.html';
            console.log(`Du är inloggad`);
        }

    } catch (error) {
        errorMsg.textContent = error.msg
    }
    fetchUserInfo();
}

const fetchUserInfo = async () => {
    // Hämta användarinformation från localStorage
    const username = localStorage.getItem(`username`);
    const email = localStorage.getItem(`email`);
    const profileImage = localStorage.getItem(`profile_image`);
    const role = localStorage.getItem(`role`);

    // Uppdatera DOM med användarinformationen
    document.querySelector(`.profile-avatar__name`).textContent = `${role}: ${username}`;
    document.querySelector(`.profile-avatar__info`).textContent = email;
    document.querySelector(`.profile-avatar__img`).src = profileImage;
}

export { loginFunction, fetchUserInfo };