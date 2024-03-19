

import apiHandler from "./apiHandler.js";
import { lazyLoadApi } from "./lazyLoader.js";
import { openNav, closeNav } from "./navSlider.js";
import { fetchUser } from "./users.js";
import { loginFunction } from "./validateLogin.js";

window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded');

    fetchUser();
    loginFunction();

    if (document.title === 'About') {
        attachEventListeners();
    } else if (document.title === 'Product') {
        fetchCoffee();
    } else if (document.title === 'Status') {
        randomOrderNumber();
    }
});

async function fetchCoffee() {
    try {
        const data = await apiHandler.fetchData('https://santosnr6.github.io/Data/airbeanproducts.json');
        renderMenu(data.menu);
    } catch (error) {
        console.error(error);
    }
}



async function renderMenu(data) {
    // LAZY LOADER
    await lazyLoadApi(data);
    const menuList = document.querySelector('.product__products');

    menuList.innerHTML = '';

    data.forEach(item => {
        const productCard = document.createElement('ul');
        productCard.classList.add('product__menu-list');

        const addIconItem = document.createElement('li');
        addIconItem.classList.add('product__item-icon');
        addIconItem.innerHTML = '<img class="menu-item-add" src="/Assets/add.svg" alt="add icon">';

        const titleDescItem = document.createElement('li');
        titleDescItem.classList.add('product__item-text');
        titleDescItem.innerHTML = `<span class="item-title">${item.title}</span><br><span class="item-desc">${item.desc}</span>`;

        const priceItem = document.createElement('li');
        priceItem.classList.add('product__item-price');
        priceItem.textContent = item.price + 'kr';

        productCard.append(addIconItem, titleDescItem, priceItem);

        menuList.appendChild(productCard);
    });
    attachEventListeners(data);
    const ProductFooter = document.querySelector('.product__footer');
    const ProductFooterimg = document.createElement('img');
    ProductFooterimg.classList.add('product__footer-img');
    ProductFooterimg.src = '../Assets/graphics-footer.svg';
    ProductFooterimg.alt = 'floral footer';
    ProductFooter.appendChild(ProductFooterimg);
}

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
        });
    });
}

function storeProductToLocalStorage(product) {
    const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    existingCartItems.push({ ...product, amount: 1 });
    localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
}

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

    populateModal();
}

function populateModal() {
    const modalContent = document.querySelector('.modal-content');

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    if (cartItems.length === 0) {
        modalContent.innerHTML = '<p>Your cart is empty... :(</p>';

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

        const increaseAmount = document.createElement('img');
        increaseAmount.src = '/Assets/arrow-up.svg';
        increaseAmount.alt = 'Increase amount';
        increaseAmount.classList.add('amount-button', 'increase');

        const amountSpan = document.createElement('span');
        amountSpan.textContent = '1';
        amountSpan.classList.add('product-amount');

        const decreaseAmount = document.createElement('img');
        decreaseAmount.src = '/Assets/arrow-down.svg';
        decreaseAmount.alt = 'Decrease amount';
        decreaseAmount.classList.add('amount-button', 'decrease');

        amountContainer.appendChild(increaseAmount);
        amountContainer.appendChild(amountSpan);
        amountContainer.appendChild(decreaseAmount);

        productDiv.appendChild(amountContainer);

        productInfoContainer.appendChild(productDiv);

        decreaseAmount.addEventListener('click', () => {
            updateAmount(amountSpan, -1);
        });

        increaseAmount.addEventListener('click', () => {
            updateAmount(amountSpan, 1);
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

function updateAmount(amountSpan, change) {
    let amount = parseInt(amountSpan.textContent);
    amount += change;

    if (amount <= 0) {
        removeProduct(amountSpan);
        return;
    }

    amountSpan.textContent = amount;

    const productTitle = amountSpan.parentNode.parentNode.querySelector('.product-title').textContent;

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.forEach(item => {
        if (item.title === productTitle) {
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

    let totalPrice = 0;
    cartItems.forEach(item => {
        if (item.title === productTitle) {
            totalPrice += parseFloat(item.price) * amount;
        } else {
            totalPrice += parseFloat(item.price);
        }
    });

    const totalPriceValue = document.querySelector('.total-price-value');
    if (isNaN(totalPrice)) {
        console.log(`Total price is NaN.`);
    }
    totalPriceValue.textContent = `${totalPrice.toFixed(0)} kr`;
}

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
        modalContent.innerHTML = '<p>Your cart is empty... :(</p>';

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
    console.log(`openNav klickad`);
});
const NavClose = document.querySelector(`.nav-page__close-icon`);
NavClose.addEventListener(`click`, () => {
    closeNav();
    console.log(`closeNav klickad`);
});

// LOGGAIN / REGISTRERA 
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkLogin").addEventListener("click", () => {
        // e.preventDefault();

        document.querySelector("#linkLogin").addEventListener("click", () => {
            // e.preventDefault();
            createAccountForm.classList.add("login__form--hidden");
            loginForm.classList.remove("login__form--hidden");
        });

        document.querySelector("#linkCreateAccount").addEventListener("click", () => {
            // e.preventDefault();
            createAccountForm.classList.remove("login__form--hidden");
            loginForm.classList.add("login__form--hidden");
        });
    });
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