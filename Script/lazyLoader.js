
// Lazy loader function

// import apiHandler from "./apiHandler.js";

const lazyLoadApi = async (url) => {
    try {
        const sectionRef = document.querySelector(`.product__main-heading`)
        sectionRef.classList.add(`d-none`);
        const ul = document.querySelector(`.product__main`);
        const loadingImg = document.createElement(`img`);
        loadingImg.classList.add(`lazy-loader`);
        loadingImg.src = `../Assets/loader.png`;
        loadingImg.alt = `Hot coffee picture`;
        ul.append(loadingImg);

        // Vänta i 2 sekunder (2000 ms)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Ta bort loader-bilden efter 2 sekunder
        loadingImg.remove();
        h1Ref.classList.remove(`d-none`);
        // Skriv ut ett errormeddelande
    } catch (error) {
        console.error(`Loader element not found`, error);
    }
}

export { lazyLoadApi }