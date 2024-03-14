
// Nav-slider


const openNav = () => {
    const openNavPage = document.querySelector(`#navPage`);
    openNavPage.classList.add(`open`);
}

const closeNav = () => {
    const closeNavPage = document.querySelector(`#navPage`);
    closeNavPage.classList.remove(`open`);
}

export { openNav, closeNav }