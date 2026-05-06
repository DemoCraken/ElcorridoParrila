function mostrarCategoria(categoria) {
    let categorias = document.querySelectorAll('.categoria');

    categorias.forEach(cat => {
        cat.classList.remove('activa');
    });

    document.getElementById(categoria).classList.add('activa');
}



/* ANUNCIO */

function mostrarPopup() {
    document.getElementById("overlay").classList.add("activo");
}

function cerrarPopup() {
    document.getElementById("overlay").classList.remove("activo");
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarPopup();
});
