
// Nav-slider

// Funktion för att öppna nav
const openNav = () => {
    const openNavPage = document.querySelector(`#navPage`);
    // Lägger till klassen open
    openNavPage.classList.add(`open`);
}

// Funktion för att stänga nav
const closeNav = () => {
    const closeNavPage = document.querySelector(`#navPage`);
    // Tar bort klassen open
    closeNavPage.classList.remove(`open`);
}

export { openNav, closeNav }