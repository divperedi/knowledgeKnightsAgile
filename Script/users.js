// Användare
const fetchUser = async () => {
    try {
        const response = await fetch(`https://santosnr6.github.io/Data/airbeanusers.json`);
        const data = await response.json();
        return data.users;
    } catch (error) {
        console.error(`Cant find data from API airbeanusers`);
        return null;
    }
}

export { fetchUser }