canvas = document.getElementById("canvas");
var rocket_img = document.getElementById("rocket");

//set the canvas size here because if we set it with css the canvas coordinates don't get updated
canvas.width = 750;
canvas.height = 500;
context = canvas.getContext("2d");

//this function blanks the screen
function clearCanvas() {
  context.fillStyle = "rgb(32, 32, 32)";
  context.fillRect(0, 0, canvas.width, canvas.height);
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

    //NOTE(Sam): the constructor takes in a starting x, and y position
      // -- x corresponds to the center of the smoke particle
      // -- y corresponds to the top of the smoke particle
      // -- each smoke particle is given a pseudo-random: velocity, and initial size
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

    //NOTE(Sam): this function updates the smoke particles: (position, velocity, size, age)
      // - and draws it to the canvas
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

    //NOTE(Sam): the contructor takes in a rocket that smokeTrail uses to align new smoke particles to
  constructor(rocket) {
    this.rocket = rocket;
    this.smokes = [];

      //NOTE(Sam): the number of smoke particles added to the smokes array each time animate() gets called
    this.smokesPerAnimation = 20;
  }

    //NOTE(Sam): this adds new smoke particles to the smokes array
      // - and removes particles that have reached their lifetime or have gone outside of the canvas
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
        x--; //NOTE(Sam): we decriment x once so we don't skip the next smoke particle
      }

      smoke.animate();
    }
  }
}

class Rocket {
  constructor(asteroid1,asteroid2,asteroid3) {
    //this.color = "white";
    this.width = 60;
    this.height = 20;
    this.smokeTrail = new SmokeTrail(this);
    this.spawn();
  }

  spawn() {
    this.position = new Vector((canvas.width/3),(canvas.height - this.height)/2);
  }

  animate() {
    var position = this.position;
    this.smokeTrail.animate();

    this.collision(asteroid1);
    this.collision(asteroid2);
    this.collision(asteroid3);

    //context.fillStyle = this.color;
    context.drawImage(rocket_img,position.x,position.y,this.width,this.height);
    //context.fillRect(position.x, position.y, this.width, this.height);
  }

  collision(asteroid) {
    if(this.position.x+this.width>Math.round(asteroid.position.x)&&this.position.x+this.width<Math.round(asteroid.position.x+asteroid.width)){
      if(this.position.y>Math.round(asteroid.position.y) && this.position.y<Math.round(asteroid.position.y+asteroid.height)){
        asteroid.spawn();
        this.spawn();
      }
    }
  }

  moveUp() {
    this.position.y-=10;
  }

  moveDown() {
    this.position.y+=10;
  }

}

class Asteroid {
  constructor() {
    this.color = "grey";
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

    context.fillStyle = this.color;
    context.fillRect(position.x, position.y, this.width, this.height);
  }

  explode() {
    this.spawn();
  }
}


asteroid1 = new Asteroid();
asteroid2 = new Asteroid();
asteroid3 = new Asteroid();
rocket = new Rocket(asteroid1,asteroid2,asteroid3);


function loop() {
  clearCanvas();
  rocket.animate();
  asteroid1.animate();
  asteroid2.animate();
  asteroid3.animate();
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
}

  //NOTE(Sam): this tell the browser to call loop every 16.6ms (60 fps)
setInterval(loop, 1000/30);
