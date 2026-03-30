let sphere;
let clickedStart = false;
let offTitle = false;
let clickedOptions = false;

function preload() {
  preLoadFont();
  sphere = loadImage("data/sphere.png");
}
function setup() {
  createCanvas(800, 500);
  loadWarGamesFont();
textSize(6);
strokeWeight(1);
}
function draw() {
  background(0);
  stroke(0, 255, 0);
  noFill();
  if (!offTitle) {
    applyMatrix(2.5,0,0,2.5,width/2,height/2);
    //when resizing the text, the only way I found that worked was resizing it with scale(); However, it displaces the text, so the next best thing to would be to
    //apply a matrix that sets your desired coordinates to the origin. Now when you resize it, it doesn't displace the text.
    //Use backticks when displaying multi-line strings
        write(`TITLE HERE`, -85, -50);
        
        resetMatrix();
        applyMatrix(1.75,0,0,1.75,width/2,height/2);
        push();
        if (clickedStart) {
          fill(0, 255, 0);
        }
        rect(-180, 75, 85, 32);
        if (clickedStart) {
          stroke(0, 0, 0);
        }
        write(`START`, -175, 100);
        pop();
        
        push();
        if (clickedOptions) {
          fill(0, 255, 0);
        }
        rect(70, 75, 118, 32);
        if (clickedOptions) {
          stroke(0, 0, 0);
        }
        write(`OPTIONS`, 75, 100);
        pop();
        
        resetMatrix();
        image(sphere, width/2 - 100, height/2 - 100 + 25, 200, 200);
  } else {
    applyMatrix(2,0,0,2,width/2,height/2);
    write(`GAME COMING SOON! :)`, -150, 0)
    
    resetMatrix();
    write(`<--`, 20, 40);
  }
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
