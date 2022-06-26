const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');

canvas.width = 1024 * 1.25;
canvas.height = 560 * 1.25;

const astroidAmount = 20;
const playersAmount = 1;
const playerMoveForce = 0.05;
const playerMaxSpeed = 3;
let bulletCoolDown = 0.2;


let astroids = [];
let players = [];
let bullets = [];
let keys = [];

let bulletInterval;
let dashInterval;
let timePassed = 0;
let coolDownEnded = true;

class Astroid {
    constructor(x, y, width, height, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.defaultColor = color;
    }
    draw(){
        c.fillStyle = this.defaultColor;
        c.fillRect(this.x, this.y, this.width, this.height);
    }
    move(){
        //Random Movement
        this.x = this.x += Math.ceil(Math.random() * 1) * (Math.round(Math.random()) ? 1 : -1);
        this.y = this.y += Math.ceil(Math.random() * 1) * (Math.round(Math.random()) ? 1 : -1);
    }
}

class Player {
    //Setup
    constructor(x, y, width, height, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.defaultColor = color;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.breakForce = 0.02;
    }
    draw(){
        c.fillStyle = this.defaultColor;
        c.fillRect(this.x, this.y, this.width, this.height);
    }
    calcPhysics(){
        //break x Velocity
        if(this.xVelocity != 0 && this.xVelocity > 0){
            this.xVelocity -= this.breakForce;
        }else if(this.xVelocity != 0 && this.xVelocity < 0){
            this.xVelocity += this.breakForce;
        }
        //break y Velocity
        if(this.yVelocity != 0 && this.yVelocity > 0){
            this.yVelocity -= this.breakForce;
        }else if(this.yVelocity != 0 && this.yVelocity < 0){
            this.yVelocity += this.breakForce;
        }
        //Aplly Force
        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }
}

class Bullet {
    constructor(x, y, width, height, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.defaultColor = color;
        this.bulletSpeed = 10;
    }
    draw(){
        c.fillStyle = this.defaultColor;
        c.fillRect(this.x, this.y, this.width, this.height);
    }
    move(){
        this.y -= this.bulletSpeed;
    }
}

function setup(){
    setupAstroids();
    setupPlayer();
}
setup();

function update(){
    refrech();
    
    astroids.forEach(box => {
        box.draw();
        box.move();
    });

    players.forEach(player => {
        player.draw();
        player.calcPhysics();
    });

    bullets.forEach(bullet => {
        bullet.draw();
        bullet.move();
    })

    keyboardInputs();
    playerXPosTeleportEffect();

}
//every 0.01 seconds
setInterval(update, 10);

function refrech(){
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
}

function setupPlayer(){
    for(i = 0; i < playersAmount; i++){
        let x = canvas.width/2 + Math.ceil(Math.random() * 200) * (Math.round(Math.random()) ? 1 : -1);;
        let y = canvas.height-200;
        let width = 25;
        let height = 50;
        
        // This uses RGB
        //random Red
        let r = generateRandomNum(0, 255).toString();
        //random Green
        let g = generateRandomNum(0, 255).toString();
        //random Blue
        let b = generateRandomNum(0, 255).toString();

        let colorCode = r.concat(',',g,',', b);
        let color = 'rgb(' + colorCode + ')';

        players[i] = new Player(x, y, width, height, color);
    }
}

function playerXPosTeleportEffect(){
    //Left effect
    if(players[0].x < 0 - players[0].width){
        players[0].x = canvas.width + players[0].width;
    }
    //right effect
    if(players[0].x > canvas.width + players[0].width){
        players[0].x = 0 - players[0].width;
    }
}

function setupAstroids(){
    for (i = 0; i < astroidAmount; i ++){
        let x = generateRandomNum(0, canvas.width);
        let y = generateRandomNum(0, 200);
        let width = generateRandomNum(50, 60);
        let height = generateRandomNum(50, 60);
        
        //this uses hsl, only random greyscale
        let k = generateRandomNum(10, 80).toString() + "%";
        color = 'hsl(0, 0%, ' + k + ')'; 
       
        astroids[i] = new Astroid(x, y, width, height, color);
    }
}


function createNewBullet(){
    if(coolDownEnded){
        clearInterval(bulletInterval);
        bulletInterval = undefined;

        bullets.push(new Bullet(players[0].x + players[0].width/2, players[0].y, 5, 10, 'red'));
        bulletInterval = setInterval(function(){setCoolDownTimer(bulletCoolDown)}, 10);
        coolDownEnded = false;
    }
    
}
function setCoolDownTimer(coolDownTime){
    timePassed += 0.01;
    if(coolDownTime - timePassed <= 0){
        //end cooldown
        timePassed = 0;
        coolDownEnded = true;
    }
    
}


function generateRandomNum(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function keyboardInputs(){
    //a
    if(keys[65] && players[0].xVelocity > -playerMaxSpeed) {
        players[0].xVelocity -= playerMoveForce;
    }
    //d
    if(keys[68] && players[0].xVelocity < playerMaxSpeed) {
        players[0].xVelocity += playerMoveForce;
    }
    //w
    if(keys[87] && players[0].yVelocity > -playerMaxSpeed) {
        players[0].yVelocity -= playerMoveForce; 
    }
    //s
    if(keys[83] && players[0].yVelocity < playerMaxSpeed){
        players[0].yVelocity += playerMoveForce;
    }
    //space
    if(keys[32]){
        createNewBullet();
    }


}

//Key Input
document.addEventListener('keydown', function(event) {
    keys[event.keyCode] = true;
});
document.addEventListener('keyup', function(event){
    keys[event.keyCode] = false;
});


