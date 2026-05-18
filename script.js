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




tsParticles.load("tsparticles", {
    background: {
        color: "transparent"
    },

    fpsLimit: 60,

    particles: {

        number: {
            value: 0
        },

        color: {
            value: [
                "#f4b942",
                "#ff7b00",
                "#ffffff"
            ]
        },

        shape: {
            type: "circle"
        },

        opacity: {
            value: 1
        },

        size: {
            value: {
                min: 2,
                max: 4
            }
        },

        move: {
            enable: true,
            speed: 8,
            direction: "none",
            outModes: {
                default: "destroy"
            }
        }
    },

    emitters: [
        {
            position: {
                x: 20,
                y: 80
            },

            rate: {
                quantity: 3,
                delay: 0.4
            }
        },

        {
            position: {
                x: 80,
                y: 20
            },

            rate: {
                quantity: 3,
                delay: 0.5
            }
        }
    ]
});

window.addEventListener("resize", () => {
    tsParticles.domItem(0).refresh();
});
