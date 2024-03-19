// Validering för att logga in
import { fetchUser } from './users.js';

const loginFunction = async () => {

    const userNameNodeRef = document.querySelector(`#username-login`);
    const pWordNodeRef = document.querySelector(`#password-login`);

    const loginData = {
        username: userNameNodeRef.value,
        password: pWordNodeRef.value
    };

    try {
        // Hämta användarlistan från API:et
        const users = await fetchUser();

        // Loopa igenom användarlistan och kontrollera inloggningsuppgifterna
        let userFound = false;

        for (let i = 0; i < users.length; i++) {
            const user = users[i]; // Hämta varje enskild användare i listan
            console.log('Jämför användare:', users[i]);
            if (user.username === loginData.username && user.password === loginData.password) {
                // Sparar användarinformation i localStorage
                localStorage.setItem('email', user.email);
                localStorage.setItem('profile_image_${i}', user.profile_image);

                // Om användaren hittas, markera det och avsluta loopen
                userFound = true;
                break;
            }
        }

        if (!userFound) {
            throw new Error('Fel användarnamn eller lösenord');
        }

        document.querySelector(`#loginBtn`).style.color = "green";
        // Om inloggningen lyckas, dirigera användaren till "profilepage.html"
        window.location.href = '../Html/profilepage.html';

    } catch (error) {
        console.error('Fel vid inloggning:', error);
        // Visa ett felmeddelande till användaren
        document.querySelector(`.login__message--error`).textContent = 'Fel användarnamn eller lösenord';
    }
    // Lägg till en händelselyssnare på inloggningsknappen
    const loginBtnRef = document.querySelector(`#loginBtn`);
    loginBtnRef.addEventListener(`click`, () => {
        loginFunction();
    });

}



export { loginFunction };
