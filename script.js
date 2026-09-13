// Rutas originales de las ilustraciones de cada categoría.
const categoryImages = {
  entradas: "assets/ICONOS/entradas.png", adicionales: "assets/ICONOS/adicionales.png",
  salchipapas: "assets/ICONOS/salchipapas.png", platanos: "assets/ICONOS/platanos.png",
  platos_a_la_carta: "assets/ICONOS/platos_a_la_carta.png", arroces: "assets/ICONOS/arroces.png",
  menu_infantil: "assets/ICONOS/menu_infantil.png", carnes_especiales: "assets/ICONOS/carnes_especiales.png",
  pastas: "assets/ICONOS/pastas.png", bowl: "assets/ICONOS/bowl.png", mazorcadas: "assets/ICONOS/mazorcadas.png",
  alitas: "assets/ICONOS/alitas.png", hamburguesas: "assets/ICONOS/hamburguesas.png",
  "hamburguesas-pollo": "assets/ICONOS/hamburguesas-pollo.png", perros: "assets/ICONOS/perros.png", bebidas: "assets/ICONOS/bebidas.png"
};

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.getElementById("categoryCards");
  const detail = document.getElementById("menuDetail");
  const searches = [document.getElementById("menuSearch"), document.getElementById("heroSearch")].filter(Boolean);
  const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const clean = element => element?.textContent.replace(/\s+/g, " ").trim() || "";
  const categories = [...document.querySelectorAll(".menu-items .categoria")].map(section => ({
    id: section.id,
    title: document.querySelector(`.categorias button[onclick*="'${section.id}'"]`)?.textContent.trim() || clean(section.querySelector("h3")),
    image: categoryImages[section.id] || "assets/LOGO_PIXELADO.png",
    rows: [...section.querySelectorAll("tbody > tr")]
  }));
  const dishesFrom = rows => rows.filter(row => !row.classList.contains("info")).map(row => {
    const cells = [...row.querySelectorAll("td")];
    const info = row.nextElementSibling?.classList.contains("info") ? clean(row.nextElementSibling) : "";
    return { name: clean(cells[0]), price: clean(cells[1]), combo: clean(cells[2]), info };
  });
  let selected = categories[0]?.id;

  function renderDetail(id, term = "") {
    const category = categories.find(item => item.id === id);
    if (!category) return;
    const query = normalize(term);
    const dishes = dishesFrom(category.rows).filter(dish => !query || normalize(`${dish.name} ${dish.info}`).includes(query));
    detail.innerHTML = `<div class="detail-header"><div><span>Sección</span><h3>${category.title}</h3></div><img src="${category.image}" alt=""></div><div class="dish-list">${dishes.length ? dishes.map(dish => `<article class="dish-item"><button class="dish-toggle" type="button"><span>${dish.name}</span><strong>${dish.price || "Ver precio"}</strong></button><div class="dish-info"><p>${dish.info || "Disponible en nuestra carta."}</p>${dish.combo ? `<span class="combo-price">Combo: ${dish.combo}</span>` : ""}</div></article>`).join("") : '<div class="detail-empty"><h3>Sin resultados</h3><p>Prueba otra palabra para encontrar tu antojo.</p></div>'}</div>`;
    detail.querySelectorAll(".dish-toggle").forEach(button => button.addEventListener("click", () => button.closest(".dish-item").classList.toggle("open")));
  }
  function renderCards(term = "") {
    const query = normalize(term); cards.innerHTML = "";
    categories.forEach(category => {
      if (query && !dishesFrom(category.rows).some(dish => normalize(`${dish.name} ${dish.info}`).includes(query))) return;
      const card = document.createElement("button");
      card.type = "button"; card.className = `menu-card ${selected === category.id ? "active" : ""}`;
      card.innerHTML = `<img src="${category.image}" alt=""><span>${category.title}</span>`;
      card.addEventListener("click", () => { selected = category.id; renderCards(term); renderDetail(selected, term); detail.scrollIntoView({ behavior: "smooth", block: "start" }); });
      cards.appendChild(card);
    });
  }
  function search(value) { renderCards(value); renderDetail(selected, value); }
  renderCards(); renderDetail(selected);
  searches.forEach(input => input.addEventListener("input", event => { searches.forEach(other => { if (other !== event.target) other.value = event.target.value; }); search(event.target.value); }));
  window.mostrarCategoria = id => { selected = id; renderCards(); renderDetail(id); document.getElementById("carta")?.scrollIntoView({ behavior: "smooth" }); };
  window.toggleInfo = row => row.nextElementSibling?.classList.toggle("oculto");
  window.mostrarPopup = () => 
    document.getElementById("overlay")?.classList.add("activo");

window.cerrarPopup = () => 
    document.getElementById("overlay")?.classList.remove("activo");


// MOSTRAR POPUP AL ENTRAR
setTimeout(() => {
    window.mostrarPopup();
}, 700);

});
