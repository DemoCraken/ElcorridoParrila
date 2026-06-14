const categoryImages = {
    entradas: "assets/ICONOS/entradas.png",
    adicionales: "assets/ICONOS/adicionales.png",
    salchipapas: "assets/ICONOS/salchipapas.png",
    platanos: "assets/ICONOS/platanos.png",
    platos_a_la_carta: "assets/ICONOS/platos_a_la_carta.png",
    arroces: "assets/ICONOS/arroces.png",
    menu_infantil: "assets/ICONOS/menu_infantil.png",
    carnes_especiales: "assets/ICONOS/carnes_especiales.png",
    pastas: "assets/ICONOS/pastas.png",
    bowl: "assets/ICONOS/bowl.png",
    mazorcadas: "assets/ICONOS/mazorcadas.png",
    alitas: "assets/ICONOS/alitas.png",
    hamburguesas: "assets/ICONOS/hamburguesas.png",
    "hamburguesas-pollo": "assets/ICONOS/hamburguesas-pollo.png",
    perros: "assets/ICONOS/perros.png",
    bebidas: "assets/ICONOS/bebidas.png"
};

let menuData = [];
let selectedCategoryId = "";
let selectedDishIndex = 0;

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function moneyFromText(text) {
    return text && text.includes("$") ? text.trim() : "";
}

function cleanDescription(text) {
    const value = text.replace(/\s+/g, " ").trim();
    return value && value !== "---------" && value !== "--------"
        ? value
        : "Pregunta por esta preparacion en el restaurante.";
}

function getCategoryButtonLabel(id) {
    const button = document.querySelector(`.categorias button[onclick*="'${id}'"]`);
    return button ? button.textContent.trim() : id.replace(/[-_]/g, " ");
}

function readMenuData() {
    menuData = Array.from(document.querySelectorAll(".menu-items .categoria")).map(category => {
        const rows = Array.from(category.querySelectorAll("tbody tr"));
        const dishes = [];

        rows.forEach((row, index) => {
            if (row.classList.contains("info")) return;

            const cells = Array.from(row.querySelectorAll("td")).map(cell => cell.textContent.trim());
            if (!cells.length) return;

            const detailRow = rows[index + 1]?.classList.contains("info") ? rows[index + 1] : null;
            const prices = cells.slice(1).filter(moneyFromText);

            dishes.push({
                name: cells[0],
                price: prices[0] || "",
                combo: prices[1] || "",
                description: detailRow ? cleanDescription(detailRow.textContent) : "Disponible en nuestra carta.",
                searchable: normalizeText(`${cells.join(" ")} ${detailRow ? detailRow.textContent : ""}`)
            });
        });

        return {
            id: category.id,
            title: getCategoryButtonLabel(category.id),
            image: categoryImages[category.id] || "assets/LOGO_PIXELADO.png",
            dishes
        };
    }).filter(category => category.dishes.length);
}

function renderCategoryCards(filter = "") {
    const cards = document.getElementById("categoryCards");
    const query = normalizeText(filter);

    cards.innerHTML = "";

    menuData.forEach(category => {
        const visibleDishes = query
            ? category.dishes.filter(dish => dish.searchable.includes(query))
            : category.dishes;

        if (!visibleDishes.length) return;

        const button = document.createElement("button");
        button.className = `menu-card ${category.id === selectedCategoryId ? "active" : ""}`;
        button.type = "button";
        button.innerHTML = `
            <img src="${category.image}" alt="">
            <span>${category.title}</span>
        `;
        button.addEventListener("click", () => selectCategory(category.id, 0, filter));
        cards.appendChild(button);
    });
}

function selectCategory(categoryId, dishIndex = 0, filter = "") {
    selectedCategoryId = categoryId;
    selectedDishIndex = dishIndex;
    renderCategoryCards(filter);
    renderDetail(filter);

    document.getElementById("menuDetail").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function renderDetail(filter = "") {
    const detail = document.getElementById("menuDetail");
    const query = normalizeText(filter);
    const category = menuData.find(item => item.id === selectedCategoryId) || menuData[0];

    if (!category) return;

    const dishes = query
        ? category.dishes.filter(dish => dish.searchable.includes(query))
        : category.dishes;

    if (!dishes.length) {
        detail.innerHTML = `
            <div class="detail-empty">
                <h3>Sin resultados</h3>
                <p>Prueba con otro nombre o revisa otra seccion.</p>
            </div>
        `;
        return;
    }

    selectedDishIndex = Math.min(selectedDishIndex, dishes.length - 1);

    detail.innerHTML = `
        <div class="detail-header">
            <div>
                <span>Seccion</span>
                <h3>${category.title}</h3>
            </div>
            <img src="${category.image}" alt="">
        </div>
        <div class="dish-list"></div>
    `;

    const list = detail.querySelector(".dish-list");

    dishes.forEach((dish, index) => {
        const article = document.createElement("article");
        article.className = `dish-item ${index === selectedDishIndex ? "open" : ""}`;
        article.innerHTML = `
            <button type="button" class="dish-toggle">
                <span>${dish.name}</span>
                <strong>${dish.price || "Ver precio"}</strong>
            </button>
            <div class="dish-info">
                <p>${dish.description}</p>
                ${dish.combo ? `<span class="combo-price">Combo: ${dish.combo}</span>` : ""}
            </div>
        `;
        article.querySelector(".dish-toggle").addEventListener("click", () => {
            selectedDishIndex = index;
            renderDetail(filter);
        });
        list.appendChild(article);
    });
}

function setupMenuInterface() {
    readMenuData();
    const firstCategory = menuData[0];
    const search = document.getElementById("menuSearch");
    const heroSearch = document.getElementById("heroSearch");

    if (!firstCategory || !search) return;

    document.querySelector(".categorias")?.setAttribute("aria-hidden", "true");
    document.querySelector(".menu-items")?.setAttribute("aria-hidden", "true");

    selectedCategoryId = firstCategory.id;
    renderCategoryCards();
    renderDetail();

    search.addEventListener("input", event => {
        const value = event.target.value;
        const foundCategory = menuData.find(category =>
            category.dishes.some(dish => dish.searchable.includes(normalizeText(value)))
        );

        if (foundCategory) {
            selectedCategoryId = foundCategory.id;
            selectedDishIndex = 0;
        }

        renderCategoryCards(value);
        renderDetail(value);
    });

    if (heroSearch) {
        heroSearch.addEventListener("input", event => {
            search.value = event.target.value;
            search.dispatchEvent(new Event("input"));
            document.getElementById("carta").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }
}

function mostrarCategoria(categoria) {
    selectCategory(categoria);
}

function toggleInfo(fila) {
    const siguiente = fila.nextElementSibling;

    if (siguiente && siguiente.classList.contains("oculto")) {
        siguiente.classList.remove("oculto");
    } else if (siguiente) {
        siguiente.classList.add("oculto");
    }
}

function mostrarPopup() {
    document.getElementById("overlay").classList.add("activo");
}

function cerrarPopup() {
    document.getElementById("overlay").classList.remove("activo");
}

document.addEventListener("DOMContentLoaded", () => {
    setupMenuInterface();
});
