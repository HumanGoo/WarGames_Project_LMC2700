let pg;

function preload() {
  preLoadFont();
  sphere = loadImage("data/sphere.png");
}
function setup() {
  createCanvas(800, 500);
  loadWarGamesFont();
textSize(6);
strokeWeight(1);
imageMode(CENTER);
pg = createGraphics(250,250,WEBGL);
pg.noFill();
pg.stroke(0,255,0);

}

function sketch1(p) {
  p.setup = function () {
    p.createCanvas(720, 200, WEBGL);
    p.background(255,255,255,0);
  };
  p.draw = function () {
    p.sphere();
  };
}

function draw() {
  
  pg.background(100,0);
  pg.sphere(80,12,12);

  background(0);
  stroke(0, 255, 0);
  noFill();
  mainMenu();
  
  image(pg,width/2, height/2);
  
}
function mousePressed() {
  // Note that all numbers must be multiplied by 1.75 b/c the matrix for the rects was scaled up by x1.75 (besides width/2 and height/2 b/c they are the
  // origin of where the scaling took place!)
  if (!offTitle) {
    if (mouseX > width/2 - (180*1.75) && mouseX < (width/2 - (180*1.75)) + 85*1.75 && mouseY > height/2 + (75*1.75) && mouseY < (height/2 + (75*1.75)) + 32*1.75) {
      clickedStart = true;
      console.log("clicked start");
    }
    if (mouseX > width/2 + (70*1.75) && mouseX < (width/2 + (70*1.75)) + 118*1.75 && mouseY > height/2 + (75*1.75) && mouseY < (height/2 + (75*1.75)) + 32*1.75) {
      clickedOptions = true;
      console.log("clicked options");
    }
  }
  else {
    if (mouseX > 20 && mouseX < 65 && mouseY > 20 && mouseY < 55) {
      offTitle = false;
    }
  }
}

function mouseReleased() {
  clickedStart = false;
  clickedOptions = false;
  if (mouseX > width/2 - (180*1.75) && mouseX < (width/2 - (180*1.75)) + 85*1.75 && mouseY > height/2 + (75*1.75) && mouseY < (height/2 + (75*1.75)) + 32*1.75) {
    offTitle = true;
  }
}
