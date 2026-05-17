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









function mostrarPopup(){
    document.getElementById("overlay")
    .classList.add("activo");
}

function cerrarPopup(){
    document.getElementById("overlay")
    .classList.remove("activo");
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarPopup();
});

/* =========================
CONFETTI
========================= */

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pieces = [];

for(let i=0;i<150;i++){

    pieces.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*6+2,
        d: Math.random()*150,
        color: [
            "#f4b942",
            "#ff7b00",
            "#ffffff",
            "#ffd166"
        ][Math.floor(Math.random()*4)],
        tilt: Math.random()*10-10
    });
}

function drawConfetti(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    pieces.forEach((p)=>{

        ctx.beginPath();

        ctx.fillStyle = p.color;

        ctx.fillRect(
            p.x,
            p.y,
            p.r,
            p.r*1.8
        );
    });

    update();
}

function update(){

    pieces.forEach((p)=>{

        p.y += 2;
        p.x += Math.sin(p.d);

        if(p.y > canvas.height){

            p.y = -20;
            p.x = Math.random()*canvas.width;
        }
    });
}

setInterval(drawConfetti,20);
