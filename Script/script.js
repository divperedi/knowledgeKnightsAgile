

import apiHandler from "./apiHandler.js";
import { lazyLoadApi } from "./lazyLoader.js";

window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded');
    fetchCoffee();
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
}