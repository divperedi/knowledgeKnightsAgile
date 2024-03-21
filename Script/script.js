

import apiHandler from "./apiHandler.js";
import { lazyLoadApi } from "./lazyLoader.js";
import { openNav, closeNav } from "./navSlider.js";
import { fetchUser } from "./users.js";
import { fetchUserInfo } from "./validateLogin.js";
import { setError, setSuccess, isValidEmail } from "./validateSignup.js";

window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded');
    fetchUser();
    if (document.title === 'About') {
        attachEventListeners();
        updateCart();
    } else if (document.title === 'Product') {
        fetchCoffee();
    } else if (document.title === 'Status') {
        randomOrderNumber();
    } else if (document.title === `Profile`) {
        fetchUserInfo();
        profilOrderTable();
    } else if (document.title === `Registrera`) {
        isValidEmail();
        setError();
        setSuccess();
    }
});

// FETCHING DATA FROM API

// Fetches data from url,
// calls the renderMenu function with fetched data,
// in case of error logs it to console
async function fetchCoffee() {
    try {
        const data = await apiHandler.fetchData('https://santosnr6.github.io/Data/airbeanproducts.json');
        renderMenu(data.menu);
    } catch (error) {
        console.error(error);
    }
}

// CREATING MENU

// Takes data array, clears the existing menu list,
// for each item in the data array creates new menu item with image, add icon, 
// title and price, appends them to menu list,
// attaches event listeners to data, appends footer img to 'product__footer'
async function renderMenu(data) {
    // LAZY LOADER
    await lazyLoadApi(data);
    const menuList = document.querySelector('.product__products');

    menuList.innerHTML = '';

    data.forEach(item => {
        document.querySelector(`.product__main-heading`).textContent = `Meny`;

        const productCard = document.createElement('ul');

        productCard.classList.add('product__menu-list');

        const addIconItem = document.createElement('li');
        addIconItem.classList.add('product__item-icon');
        addIconItem.innerHTML = '<img class="menu-item-add" src="/Assets/add.svg" alt="add icon">';

        const imageItem = document.createElement('img');
        imageItem.classList.add('product__item-image');
        imageItem.src = item.image;
        imageItem.alt = item.title;

        const titleDescItem = document.createElement('li');
        titleDescItem.classList.add('product__item-text');
        titleDescItem.innerHTML = `<span class="item-title">${item.title}</span><br><span class="product__item-price">${item.price + 'kr'}</span>`;

        productCard.append(addIconItem, imageItem, titleDescItem);
        menuList.appendChild(productCard);
        updateCart();
    });
    attachEventListeners(data);
    const ProductFooter = document.querySelector('.product__footer');
    const ProductFooterimg = document.createElement('img');
    ProductFooterimg.classList.add('product__footer-img');
    ProductFooterimg.src = '../Assets/graphics-footer.svg';
    ProductFooterimg.alt = 'floral footer';
    ProductFooter.appendChild(ProductFooterimg);
}

// ADDING EVENT LISTENERS TO SHOPPING CART, ADD ICON, 
// PRODUCT IMAGE AND DESCRIPTION

// Attaches click event listeners to 'product__nav-cart',
// and each product image and text,
// checks if modal is open, if not - creates modal, 
// for each 'product__item-icon' -
// stores the corresponding product data to local storage 
// and logs a message to the console
function attachEventListeners(data) {

    document.querySelector('.product__nav-cart').addEventListener('click', (event) => {
        const isModalOpen = document.querySelector('.modal') !== null;
        if (isModalOpen) {
            event.preventDefault();
        } else {
            createModal(data);
        }
    });

    const addIconItems = document.querySelectorAll('.product__item-icon');
    addIconItems.forEach(addIconItem => {
        addIconItem.addEventListener('click', () => {
            const index = Array.from(addIconItem.parentNode.parentNode.children).indexOf(addIconItem.parentNode);
            const product = data[index];
            storeProductToLocalStorage(product);
            console.log('Item added to local storage:', product);
            addOrder();
        });
    });

    const productImages = document.querySelectorAll('.product__item-image');
    const productTexts = document.querySelectorAll('.product__item-text');

    productImages.forEach((image, index) => {
        image.addEventListener('click', () => {
            const product = data[index];
            createModalDetails(product);
        });
    });

    productTexts.forEach((text, index) => {
        text.addEventListener('click', () => {
            const product = data[index];
            createModalDetails(product);
        });
    });
}

// STORING PRODUCTS IN LOCAL STORAGE

// Takes product object, gets items that are in the cart from local storage, 
//adds product to the cart items with amount of 1, and then stores updated cart items back to local storage
function storeProductToLocalStorage(product) {
    const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingProduct = existingCartItems.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.amount += 1;
    } else {
        existingCartItems.push({ ...product, amount: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
}

// CREATING POP UP WINDOW FOR EVERY PRODUCT

// Dynamically creates modal with detailed info about product - 
// image, title, price, rating, description, 
// appends them to the html
function createModalDetails(item) {
    const modal = document.createElement('div');
    modal.classList.add('details-modal');

    const detailsContainer = document.createElement('section');
    detailsContainer.classList.add('details-modal-content');

    const productImage = document.createElement('img');
    productImage.src = item.image;
    productImage.alt = item.title;
    productImage.classList.add('product-image');

    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('description-container');

    const titleElement = document.createElement('p');
    titleElement.textContent = item.title;
    titleElement.classList.add('product-title');

    const priceElement = document.createElement('p');
    priceElement.textContent = `${item.price} kr`;
    priceElement.classList.add('product-price');

    const ratingElement = document.createElement('p');
    ratingElement.textContent = `Rating: ${item.rating}`;
    ratingElement.classList.add('product-rating');

    const longerDescElement = document.createElement('p');
    longerDescElement.textContent = item.longer_desc;
    longerDescElement.classList.add('product-longer-desc');

    descriptionContainer.append(titleElement, priceElement, ratingElement, longerDescElement);

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '&times;';

    detailsContainer.appendChild(productImage);
    detailsContainer.appendChild(descriptionContainer);
    detailsContainer.appendChild(closeButton);

    modal.appendChild(detailsContainer);

    document.body.appendChild(modal);

    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    setupModalCloseButton();
}

// ADDING CLOSE BUTTON TO POP UP PRODUCT +
// EVENT LISTENER TO REMOVE MODAL 

// Adds close button to modal,
// sets up event listener to remove modal from DOM 
// when close button is clicked
function setupModalCloseButton() {
    const modalContent = document.querySelector('.details-modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '&times;';

    modalContent.appendChild(closeButton);

    closeButton.addEventListener('click', () => {
        modalContent.closest('.details-modal').remove();
    });
}

// CREATING POP UP CART

// Creates new modal section with close button, 
// appends it to the page,
// attaches click event listener to close button,
// it removes modal when clicked, 
// calls the populateModal function
function createModal() {
    const modal = document.createElement('section');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <section class="modal-content">
            <h1 class="order-heading">Din beställning
                <span class="close-button">&times;</span>
            </h1>
        </section>
    `;
    document.body.appendChild(modal);

    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    setTimeout(() => {
        populateModal();
    }, 50);
}

// CREATING CONTENT INSIDE POP UP CART

// Populates modal with cart items stored in local storage, 
// creating elements for each item's title, price, quantity,
// increase and decrease functionality, total price, take my money btn
// if the cart is empty - displays message
function populateModal() {
    const modalContent = document.querySelector('.modal-content');

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    if (cartItems.length === 0) {
        modalContent.innerHTML = '<p class="empty-cart">Your cart is empty... :(</p>';

        const closeButton = document.createElement('span');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = '&times;';

        const modal = document.querySelector('.modal');
        closeButton.addEventListener('click', () => {
            modal.remove();
        });

        modalContent.appendChild(closeButton);

        return;
    }

    const productInfoContainer = document.createElement('div');
    productInfoContainer.classList.add('product-info-container');

    cartItems.forEach(item => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-div');

        const titlePriceContainer = document.createElement('div');
        titlePriceContainer.classList.add('title-price-container');

        const titleElement = document.createElement('p');
        titleElement.textContent = item.title;
        titleElement.classList.add('product-title');

        const priceElement = document.createElement('p');
        priceElement.textContent = `${item.price} kr`;
        priceElement.classList.add('product-price');

        titlePriceContainer.appendChild(titleElement);
        titlePriceContainer.appendChild(priceElement);

        productDiv.appendChild(titlePriceContainer);

        const amountContainer = document.createElement('div');
        amountContainer.classList.add('amount-container');

        const decreaseAmount = document.createElement('button');
        decreaseAmount.textContent = '-';
        decreaseAmount.alt = 'Decrease amount';
        decreaseAmount.classList.add('amount-button', 'decrease');

        const amountSpan = document.createElement('span');
        amountSpan.textContent = '1';
        amountSpan.classList.add('product-amount');

        const increaseAmount = document.createElement('button');
        increaseAmount.textContent = '+';
        increaseAmount.alt = 'Increase amount';
        increaseAmount.classList.add('amount-button', 'increase');

        amountContainer.appendChild(decreaseAmount);
        amountContainer.appendChild(amountSpan);
        amountContainer.appendChild(increaseAmount);

        productDiv.appendChild(amountContainer);

        productInfoContainer.appendChild(productDiv);

        decreaseAmount.addEventListener('click', () => {
            updateAmount(amountSpan, -1);
            removeOrder();
        });

        increaseAmount.addEventListener('click', () => {
            updateAmount(amountSpan, 1);
            addOrder();
        });
    });

    const totalPriceContainer = document.createElement('div');
    totalPriceContainer.classList.add('total-price-container');

    const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0);

    const totalPriceText = document.createElement('p');
    totalPriceText.textContent = `Total`;
    totalPriceText.classList.add('total-price-text');

    const additionalInfo = document.createElement('p');
    additionalInfo.textContent = 'inkl moms + drönarleverans';
    additionalInfo.classList.add('additional-info');

    totalPriceContainer.appendChild(totalPriceText);
    totalPriceContainer.appendChild(additionalInfo);

    const totalPriceValue = document.createElement('p');
    totalPriceValue.textContent = `${totalPrice} kr`;
    totalPriceValue.classList.add('total-price-value');

    totalPriceContainer.appendChild(totalPriceValue);

    const takeMyMoneyButton = document.createElement('button');
    takeMyMoneyButton.textContent = 'Take my money!';
    takeMyMoneyButton.classList.add('take-my-money-button');

    modalContent.appendChild(productInfoContainer);
    modalContent.appendChild(totalPriceContainer);
    modalContent.appendChild(takeMyMoneyButton);

    takeMyMoneyButton.addEventListener('click', () => {
        window.location.href = '../Html/status.html';
    });
}

// KEEPING TOTAL PRICE UPDATED

// Updates quantity of products in cart, 
// recalculates price for that product and total price,
// displays them in modal,
// if product amount is less than 1 - removes it from cart
function updateAmount(amountSpan, change) {
    let amount = parseInt(amountSpan.textContent);
    amount += change;

    if (amount <= 0) {
        removeProduct(amountSpan);
        return;
    }

    amountSpan.textContent = amount;

    const productTitle = amountSpan.parentNode.parentNode.querySelector('.product-title').textContent;

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.forEach(item => {
        if (item.title === productTitle) {
            item.amount = amount;

            const productDiv = amountSpan.closest('.product-div');
            const priceElement = productDiv.querySelector('.product-price');
            const unitPrice = parseFloat(item.price);
            const totalPrice = (unitPrice * amount).toFixed(0);
            if (isNaN(totalPrice)) {
                console.log(`Total price for ${productTitle} is NaN.`);
            }
            priceElement.textContent = `${totalPrice} kr`;
        }
    });

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    let totalPrice = 0;
    cartItems.forEach(item => {
        totalPrice += parseFloat(item.price) * item.amount;
    });

    const totalPriceValue = document.querySelector('.total-price-value');
    if (isNaN(totalPrice)) {
        console.log(`Total price is NaN.`);
    }
    totalPriceValue.textContent = `${totalPrice.toFixed(0)} kr`;
}

// UPDATING LOCAL STORAGE ON CHANGES IN CART,
// CREATING CLOSE BUTTON TO LEAVE EMPTY CART

// Removes product from cart and local storage, 
// updates total price displayed in modal, 
// if cart becomes empty - updates modal content to display message 
// and close button that removes modal when clicked
function removeProduct(amountSpan) {
    const productTitle = amountSpan.parentNode.parentNode.querySelector('.product-title').textContent;
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(item => item.title !== productTitle);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    const productDiv = amountSpan.closest('.product-div');
    productDiv.remove();

    const totalPriceValue = document.querySelector('.total-price-value');
    const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0);
    totalPriceValue.textContent = `${totalPrice.toFixed(0)} kr`;

    if (cartItems.length === 0) {
        const modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = '<p class="empty-cart">Your cart is empty... :(</p>';

        const closeButton = document.createElement('span');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = '&times;';

        const modal = document.querySelector('.modal');
        closeButton.addEventListener('click', () => {
            modal.remove();
        });

        modalContent.appendChild(closeButton);
    }
}

// Nav slider
const NavOpen = document.querySelector('.product__nav-hamburger');
NavOpen.addEventListener('click', () => {
    openNav();
});
const NavClose = document.querySelector(`.nav-page__close-icon`);
NavClose.addEventListener(`click`, () => {
    closeNav();
});


// Status page -- unika ordernummer
function randomOrderNumber() {
    const orderNumberElement = document.querySelector('.status__ordernbr');
    function generateOrderNumber(length = 7) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return `#${result}`;
    }
    const randomOrdernbr = generateOrderNumber();
    orderNumberElement.textContent = randomOrdernbr;
}

// function för att räkna antal produkter i varukorgen
let totalorder = 0;
function addOrder() {
    totalorder++;
    updateCart();
}

function removeOrder() {
    totalorder--;
    updateCart();
}

function updateCart() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    totalorder = cartItems.reduce((total, item) => total + item.amount, 0);
    const totalorderElement = document.querySelector('#totalorder');
    totalorderElement.textContent = totalorder;
}

function profilOrderTable() {
    const container = document.querySelector('.profile-order__container');
    let tableElement = container.querySelector('.profile-order__table');
    
    if (!tableElement) {
        tableElement = document.createElement('table');
        tableElement.classList.add('profile-order__table');
        
        const tableHeader = document.createElement('tr');
        tableHeader.classList.add('profile-order__row');
        tableHeader.innerHTML = `
            <th class="profile-order__cell">Produkt</th>
            <th class="profile-order__cell">Pris</th>
            <th class="profile-order__cell">Antal</th>
            <th class="profile-order__cell">Total</th>
            <th class="profile-order__cell">Ta bort</th>
            <th class="profile-order__cell">Lägg till</th>
        `;
        tableElement.appendChild(tableHeader);
        
        container.appendChild(tableElement);
    }
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const tbody = document.createElement('tbody');
    
    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.classList.add('profile-order__row');
        row.innerHTML = `
            <td class="profile-order__cell">${item.title}</td>
            <td class="profile-order__cell">${item.price} kr</td>
            <td class="profile-order__cell">${item.amount}</td>
            <td class="profile-order__cell">${(item.amount * parseFloat(item.price)).toFixed(2)} kr</td>
            <td class="profile-order__cell"> <button class="amount-button decrease">-</button></td>
            <td class="profile-order__cell"><button class="amount-button increase">+</button></td>
        `;
        tbody.appendChild(row);
    });
    
    const existingTbody = tableElement.querySelector('tbody');
    if (existingTbody) {
        tableElement.replaceChild(tbody, existingTbody);
    } else {
        tableElement.appendChild(tbody);
    }

    const increaseButtons = document.querySelectorAll('.increase');
    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const title = button.parentNode.parentNode.querySelector('.profile-order__cell:first-child').textContent;
            updateQuantity(title, 1);
        });
    });

    const decreaseButtons = document.querySelectorAll('.decrease');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const title = button.parentNode.parentNode.querySelector('.profile-order__cell:first-child').textContent;
            updateQuantity(title, -1);
        });
    });
}

function updateQuantity(title, change) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = cartItems.find(item => item.title === title);

    if (item) {
        item.amount += change;
        if (item.amount <= 0) {
            cartItems = cartItems.filter(item => item.title !== title);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        profilOrderTable();
    }
}
