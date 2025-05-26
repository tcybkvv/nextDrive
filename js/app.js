const carsPerPage = 24;
let currentPage = 1;
let currentData = [];
let originalData = [];
let inDollars = false;

const loader = document.querySelector(".loader");

const renderCars = () => {
    const main = document.querySelector(".main");
    main.classList.remove("details-view");
    const container = document.getElementById("cars");
    container.innerHTML = "";
    const start = (currentPage - 1) * carsPerPage;
    const end = start + carsPerPage;
    currentData.slice(start, end).forEach(car => {
        const card = document.createElement("div");
        card.className = "car-card";
        card.innerHTML = `
            <img src="${car.photos[0]}" alt="${car.name}">
            <h3 class="car-name">${car.name}</h3>
            <p>${formatPrice(car.price)}</p>
        `;
        card.onclick = () => showCarDetails(car);
        container.appendChild(card);
    });
    renderPagination();
    window.scrollTo(0, 0);
};

const renderPagination = () => {
    const pages = Math.ceil(currentData.length / carsPerPage);
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";
    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) btn.disabled = true;
        btn.onclick = () => { currentPage = i; renderCars(); };
        pagination.appendChild(btn);
    }
};

const formatPrice = (price) => {
    if (inDollars) {
        const usdPrice = Math.round(price / 87.45);
        return usdPrice.toLocaleString('ru-RU') + ' usd';
    } else {
        return price.toLocaleString('ru-RU') + ' сом';
    }
};

const showCarDetails = (car) => {
    const main = document.querySelector(".main");
    main.classList.add("details-view");
    const container = document.getElementById("cars");
    container.innerHTML = "";
    container.style.display = "block";

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "car-details-container";

    const callButton = document.createElement("button");
    callButton.textContent = "Позвонить";

    const backButton = document.createElement("button");
    backButton.textContent = "Вернуться";
    backButton.onclick = () => {
        renderCars();
        container.style.display = "flex";
    };

    const carousel = document.createElement("div");
    carousel.className = "carousel";
    const imagesContainer = document.createElement("div");
    imagesContainer.className = "images";
    car.photos.forEach((photo, index) => {
        const img = document.createElement("img");
        img.src = photo;
        if (index === 0) img.className = "active";
        imagesContainer.appendChild(img);
    });

    const prevButton = document.createElement("div");
    prevButton.className = "carousel-button prev";
    prevButton.innerHTML = `<img src="https://raw.githubusercontent.com/tcybkvv/nextDrive_data/refs/heads/main/images/icon-left-arrow.svg" alt="leftButton"/>`;

    const nextButton = document.createElement("div");
    nextButton.className = "carousel-button next";
    nextButton.innerHTML = `<img src="https://raw.githubusercontent.com/tcybkvv/nextDrive_data/refs/heads/main/images/icon-right-arrow.svg" alt="rightButton"/>`;

    let currentIndex = 0;
    const showNext = () => {
        const images = imagesContainer.querySelectorAll("img");
        images[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add("active");
    };
    const showPrev = () => {
        const images = imagesContainer.querySelectorAll("img");
        images[currentIndex].classList.remove("active");
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        images[currentIndex].classList.add("active");
    };
    prevButton.onclick = showPrev;
    nextButton.onclick = showNext;

    carousel.appendChild(prevButton);
    carousel.appendChild(imagesContainer);
    carousel.appendChild(nextButton);
    detailsContainer.appendChild(carousel);

    const details = document.createElement("div");
    details.className = "car-details";
    details.innerHTML = `
        <h2>${car.name}</h2>
        <h3>${formatPrice(car.price)}</h3>
        <p><b>Год выпуска:</b> ${car.year}</p>
        <p><b>Руль:</b> ${car.steering}</p>
        <p><b>Цвет:</b> ${car.color}</p>
        <p><b>Кузов:</b> ${car.body}</p>
        <p><b>Привод:</b> ${car.drive}</p>
        <p><b>Пробег:</b> ${car.mileage} km</p>
        <p><b>Двигатель:</b> ${car.engine}</p>
        <p><b>Состояние:</b> ${car.condition}</p>
    `;
    details.appendChild(callButton);
    details.appendChild(backButton);
    detailsContainer.appendChild(details);

    container.appendChild(detailsContainer);
};

const sortSelect = document.getElementById("sortSelect");
sortSelect.onchange = () => {
    const sortValue = sortSelect.value;
    if (sortValue === "default") {
        currentData = originalData.slice();
    } else if (sortValue === "asc") {
        currentData = originalData.slice().sort((a, b) => a.price - b.price);
    } else if (sortValue === "desc") {
        currentData = originalData.slice().sort((a, b) => b.price - a.price);
    }
    renderCars();
};

const toggle = document.getElementById("currencyToggle");
toggle.onchange = () => {
    inDollars = toggle.checked;
    renderCars();
};

loader.style.display = "flex";

fetch("https://raw.githubusercontent.com/tcybkvv/nextDrive_data/refs/heads/main/data/cars.json")
    .then(res => res.json())
    .then(json => {
        originalData = json.cars.slice();
        currentData = originalData.slice();
        renderCars();
    })
    .catch(err => console.error("Ошибка загрузки JSON:", err))
    .finally(() => {
        loader.style.display = "none";
    });

// TOGGLE THEME

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');

    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark-theme');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
        document.documentElement.classList.toggle('dark-theme');
        if (document.documentElement.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
});

//FOOTER DATE

document.getElementById("year").textContent = new Date().getFullYear();