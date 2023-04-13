var canvas = document.getElementById("renderer");
var ctx = canvas.getContext("2d");

//#region CONSTANTES
const GRAVITY_FORCE = 0.2;
const GROUND_HEIGHT = 500;

// couleures
const c_background = "#8397FF";
const c_dots = "red";
const c_muscles = "black";
const c_ground = "#07AB18";
//#endregion

//#region CREATURE
class Creature {
    constructor() {
        this.dots = [];
        this.muscles = [];
        this.clock = 0;
    }
}
//#endregion

//#region VARIABLES
var camX = 100;
var camY = 100;

// souris
var mouseX = 0;
var mouseY = 0;
var mouseLeft = false;
var mouseCamOffsetX = 0;
var mouseCamOffsetY = 0;

// creature
var creature = new Creature();
/*
====[DOTS STRUCTURE]====
x, y, velocityX, velocityY
*/
/*
====[MUSCLES STRUCTURE]====
dotA, dotB, lengthA, lengthB, lenghtAtime, clockOffest, force
*/

creature.dots.push([0, 0, 0, 0]);
creature.dots.push([40, 30, 0, 0]);
creature.dots.push([0, 60, 0, 0, 0]);
creature.muscles.push([0, 1, 50, 70, 30, 0, 0.1]);
creature.muscles.push([2, 1, 80, 50, 50, 10, 0.15]);
creature.muscles.push([0, 2, 90, 40, 70, 5, 0.2]);

/*
creature.dots.push([0, 0, 0, 0, 0]);
creature.dots.push([100, 0, 0, 0, 0]);
creature.muscles.push([0, 1, 50, 100, 50, 0, 0.1]);*/
//#endregion

function loop() {
    if(mouseLeft) {
        camX = mouseX + mouseCamOffsetX;
        camY = mouseY + mouseCamOffsetY;
    }

    //#region MOVE CREATURE
    // move clock
    creature.clock ++;
    if (creature.clock >= 100) {
        creature.clock = 0;
    }
    // calc muscles
    for (var i = 0; i < creature.muscles.length; i++) {
        var xDis = creature.dots[creature.muscles[i][0]][0] - creature.dots[creature.muscles[i][1]][0];
        var yDis = creature.dots[creature.muscles[i][0]][1] - creature.dots[creature.muscles[i][1]][1];
        var disLenght = Math.sqrt(Math.abs(xDis)**2 + Math.abs(yDis)**2);
        var xDir = xDis / disLenght;
        var yDir = yDis / disLenght;
        var i_len = (creature.clock + creature.muscles[i][5]) % 100 <= creature.muscles[i][4] ? 2 : 3;
        var xForce = xDir * (creature.muscles[i][i_len] - disLenght) * creature.muscles[i][6] - creature.dots[creature.muscles[i][0]][2];
        var yForce = yDir * (creature.muscles[i][i_len] - disLenght) * creature.muscles[i][6] - creature.dots[creature.muscles[i][0]][3];
        // dot a
        creature.dots[creature.muscles[i][0]][2] += xForce / 2;
        creature.dots[creature.muscles[i][0]][3] += yForce / 2;
        // dot b
        creature.dots[creature.muscles[i][1]][2] -= xForce / 2;
        creature.dots[creature.muscles[i][1]][3] -= yForce / 2;
    }
    for (var i = 0; i < creature.dots.length; i++) {
        // calc gravity
        if (creature.dots[i][1] + creature.dots[i][3] <= GROUND_HEIGHT) {
            creature.dots[i][3] += GRAVITY_FORCE;
        } else {
            creature.dots[i][3] = GROUND_HEIGHT - creature.dots[i][1];
        }
        // move dots
        creature.dots[i][0] += creature.dots[i][2];
        creature.dots[i][1] += creature.dots[i][3];
    }
    //#endregion

    //#region AFFICHAGE
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //#region FOND
    ctx.fillStyle = c_background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //#endregion
    
    //#region SOL
    ctx.fillStyle = c_ground;
    ctx.fillRect(0, camY + GROUND_HEIGHT + 10, canvas.width, canvas.height - camY);
    //#endregion

    //#region CREATURE
    // muscles
    ctx.strokeStyle = c_muscles;
    ctx.lineWidth = 7;
    for (var i = 0; i < creature.muscles.length; i++) {
        ctx.beginPath();
        ctx.moveTo(camX + creature.dots[creature.muscles[i][0]][0], camY + creature.dots[creature.muscles[i][0]][1]);
        ctx.lineTo(camX + creature.dots[creature.muscles[i][1]][0], camY + creature.dots[creature.muscles[i][1]][1]);
        ctx.stroke();
    }
    // dots
    ctx.fillStyle = c_dots;
    for (var i = 0; i < creature.dots.length; i++) {
        ctx.beginPath();
        ctx.arc(camX + creature.dots[i][0], camY + creature.dots[i][1], 10, 0, 2 * Math.PI);
        ctx.fill();
    }
    //#endregion
    //#endregion
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
document.addEventListener("mousedown", (e) => {
    if (e.which === 1) {
        mouseLeft = true;
        mouseCamOffsetX = camX - mouseX;
        mouseCamOffsetY = camY - mouseY;
    }
});
document.addEventListener("mouseup", (e) => {
    if (e.which === 1) {
        mouseLeft = false;
    }
});