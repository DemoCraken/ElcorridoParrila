function mostrarCategoria(categoria) {
    let categorias = document.querySelectorAll('.categoria');

    categorias.forEach(cat => {
        cat.classList.remove('activa');
    });

    document.getElementById(categoria).classList.add('activa');
}
