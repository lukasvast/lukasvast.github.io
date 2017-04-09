canvas = document.getElementById("canvas");
var rocket_img = document.getElementById("rocket");
var asteroid_normal_img = document.getElementById("asteroid_normal");
var asteroid_scatered_img = document.getElementById("asteroid_scatered");
var startgame = document.getElementById("startgame");

var game_over = false;

//set the canvas size here because if we set it with css the canvas coordinates don't get updated
canvas.width = 750;
canvas.height = 500;
context = canvas.getContext("2d");

//this function blanks the screen
function clearCanvas() {
  context.fillStyle = "rgb(32, 32, 32)";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

//this function creates main menu
function mainMenu() {

  //play game button
  context.fillStyle = "rgb(0, 0, 32)";
  context.drawImage(startgame,canvas.width/2-100, canvas.height/2-50, 200, 100);
  canvas.addEventListener('mousedown',function(e) {
    if (e.pageX>canvas.width/2-100 && e.pageX<canvas.width/2+100 && e.pageY>canvas.height/2-50 && e.pageY<canvas.height/2+50) {
      game_over=false;
    }
  },false);

}

//this class wraps an x and y component
class Vector {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x+= vector.x;
    this.y+= vector.y;
  }
}

//helper function to check if object in canvas
function inbounds(x, y, w, h) {
  if(x > canvas.width || (x+w) < 0 || (y+h) < 0 || y > canvas.height) {
     return false;
  } else {
     return true;
  }
}

//helper random function
function random(min, max) {
  return Math.random() * (max-min) + min;
}

//particle of smoke
//each paritcle is represented by a square that has an age and a lifetime
//the particles size is proportinal to how far it has progressed in its life
class Smoke {

  constructor(x, y) {
    var colors = ["red","yellow","red"];
    var index = Math.round(random(0,2));
    this.color = colors[index];
    this.maxSize = random(4, 6);

    var maxLifetime = 150;
    this.maxLifetime = maxLifetime;
    this.lifetime = random(1, maxLifetime);
    this.age = 0;

    this.gravity = new Vector(-.05, 0);
    this.windSpeed = -.18;
    this.position = new Vector(x, (y- this.maxSize/2));

    var maxVelocity = -5;
    this.maxVelocity = maxVelocity;
    this.velocity = new Vector(random(0, maxVelocity), random(-maxVelocity, maxVelocity));

  }

  animate() {
    var position = this.position;
    var velocity = this.velocity;

    velocity.add(this.gravity);
    velocity.x+= random(-this.windSpeed, this.windSpeed);

    position.add(velocity)

    var size = this.maxSize * (1 - (this.age / this.lifetime));

    context.fillStyle = this.color;
    context.fillRect(position.x, position.y, size, size);
    this.age++;
  }
}

//group of smoke particles
class SmokeTrail {

  constructor(rocket) {
    this.rocket = rocket;
    this.smokes = [];

    this.smokesPerAnimation = 15;
  }

  animate() {
    var smokes = this.smokes;
    var rocket = this.rocket;
    for(var x = 0; x < this.smokesPerAnimation; x++) {
      smokes.push(new Smoke((rocket.position.x-5), (rocket.position.y+rocket.height/2)));
    }

    for(var x = 0; x < smokes.length; x++) {
      var smoke = smokes[x];

      if( !inbounds(smoke.position.x, smoke.position.y, smoke.size, smoke.size)
          || smoke.age >= smoke.lifetime) {

        smokes.splice(x, 1);
        x--;
      }

      smoke.animate();
    }
  }
}


class Rocket {

  constructor(asteroid1,asteroid2,asteroid3) {
    this.width = 60;
    this.height = 20;
    this.smokeTrail = new SmokeTrail(this);
    this.spawn();
  }

  spawn() {
    this.position = new Vector((canvas.width/3),(canvas.height - this.height)/2);
    //this.projectile = new Projectile(this.position.x+this.width,this.position.y+this.height/2);
  }

  animate() {
    var position = this.position;
    this.smokeTrail.animate();

    this.collision(asteroid1);
    this.collision(asteroid2);
    this.collision(asteroid3);

    context.drawImage(rocket_img,position.x,position.y,this.width,this.height);
  }

  collision(asteroid) {
    if(this.position.x+this.width>Math.round(asteroid.position.x) && this.position.x+this.width<Math.round(asteroid.position.x+asteroid.width)){
      if(this.position.y+this.height/2>Math.round(asteroid.position.y) && this.position.y+this.height/2<Math.round(asteroid.position.y+asteroid.height)){
        asteroid.explode();
        this.explode();
      }
    }
  }

  moveUp() {
    this.position.y-=10;
  }

  moveDown() {
    this.position.y+=10;
  }

  explode() {
    gameOver();
  }

}

class Asteroid {
  constructor() {
    var asteroid_image = [asteroid_normal_img,asteroid_scatered_img];
    var index = Math.round(random(0,1));
    this.image = asteroid_image[index];
    this.width = random(30,60);
    this.height = random(30,60);
    this.speed = new Vector(-random(3,7),random(0,0.5));
    this.spawn();
  }

  spawn() {
    this.position = new Vector((canvas.width),random((0+this.height),(canvas.height-this.height)));
  }

  animate() {
    var position = this.position;
    position.add(this.speed);

    if(!inbounds(this.position.x,this.position.y,this.width,this.height)){
      this.spawn();
    }

    context.drawImage(this.image,position.x,position.y,this.width,this.height);
  }

  explode() {
    this.spawn();
  }
}

class Projectile {
  constructor(rocket,asteroid1,asteroid2,asteroid3) {
    this.color="red";
    this.speed=10;
    this.width=10;
    this.height=2;
    this.position=new Vector(rocket.position.x+rocket.width,rocket.position.y+rocket.height/2);
  }

  animate() {
    this.collision(asteroid1);
    this.collision(asteroid2);
    this.collision(asteroid3);

    context.fillStyle = this.color;
    context.fillRect(this.position.x+=this.speed, this.position.y, this.width, this.height);
  }

  collision(asteroid) {
    if(this.position.x+this.width>Math.round(asteroid.position.x) && this.position.x+this.width<Math.round(asteroid.position.x+asteroid.width)){
      if(this.position.y+this.height/2>Math.round(asteroid.position.y) && this.position.y+this.height/2<Math.round(asteroid.position.y+asteroid.height)){
        asteroid.explode();
      }
    }
  }

}


var asteroid1 = new Asteroid();
var asteroid2 = new Asteroid();
var asteroid3 = new Asteroid();
var rocket = new Rocket(asteroid1,asteroid2,asteroid3);
var projectiles = [];

function loop() {
  if(!game_over) {
    clearCanvas();
    rocket.animate();
    asteroid1.animate();
    asteroid2.animate();
    asteroid3.animate();
    projectiles.forEach(function(projectile) {
      projectile.animate();
    });
  }
  else {
    clearCanvas();
    mainMenu();
  }
}

function gameOver() {
  game_over = true;
}

window.addEventListener('keydown',this.check,false);
function check(e) {
  if(e.keyCode==38)
  {
    rocket.moveUp();
  }
  else if (e.keyCode==40)
  {
    rocket.moveDown();
  }
  else if (e.keyCode==32)
  {
    projectiles.push(new Projectile(rocket,asteroid1,asteroid2,asteroid3));
  }
}

//this tell the browser to call loop every 16.6ms (60 fps)
if(game_over==false) {
  setInterval(loop, 1000/30);
}
