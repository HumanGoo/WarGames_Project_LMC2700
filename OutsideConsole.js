let dialogueChoices;
let nuclearMeltDown = false;
let givenDialogueChoices = false;
let dialogueChoicesInitialized = false;
function outsideConsole(c) {
  c.setup = function() {
    c.imageMode(CENTER);
    c.ellipseMode(CENTER);
    c.cnv = c.createCanvas(windowWidth, windowHeight);
    c.cnv.position(0, 0);
  }
  c.draw = function() {
    c.showBackground();
    if (givenDialogueChoices && !dialogueChoicesInitialized) {
      dialogueChoicesInitialized = true;
      c.choices = [];
      dialogueChoices.forEach(elem => {
        c.choices.push(new DialogueChoice(elem.label, elem.linkTo));
      }
      );
    }
    if (DialogueChoice.hasBeenPicked) {
      c.choices.forEach(elem => {
        elem.button.remove()
      }
      )
      c.choices.length = 0;
      dialogueChoicesInitialized = false;
      givenDialogueChoices = false;
    }
  }

  c.mousePressed = function() {
    c.mouseLoc = new p5.Vector(c.mouseX, c.mouseY);
    c.strokeWeight(10);
    c.buttonR = new p5.Vector(c.windowWidth/2, (c.windowHeight + 450)/2 + 40);

    if (c.mouseLoc.sub(c.buttonR).mag() < 60) {
      console.log("hello")
        nuclearMeltDown = true;
    }
  }

  c.showBackground = function() {

    c.background(100);


    c.strokeWeight(5);
    c.stroke(0);

    c.fill(150);
    //table
    c.beginShape();
    c.vertex(computer.location.x, computer.location.y + computer.size.height);
    c.vertex(computer.location.x + computer.size.width, computer.location.y + computer.size.height);
    c.vertex(c.width, c.height);
    c.vertex(0, c.height);
    c.vertex(computer.location.x, computer.location.y + computer.size.height);
    c.endShape();
    //button

    if(!DialogueChoice.positionInitialized) {
      DialogueChoice.position = new p5.Vector(c.width/2 - 200, (c.height + 450)/2 - 35);
      DialogueChoice.origin = new p5.Vector(c.width/2 - 200, (c.height + 450)/2 - 35);
      DialogueChoice.positionInitialized = true;
    }
    c.strokeWeight(5);
    c.fill(140);
    c.ellipse(c.width/2, (c.height + 450)/2 + 55, 150, 120);
    c.fill(255, 0, 0);
    c.ellipse(c.width/2, (c.height + 450)/2 + 50, 125, 100);
    c.ellipse(c.width/2, (c.height + 450)/2 + 40, 125, 100);
  }
}


//created overlay
function overlay(o) {
  o.redOpacity = 0;
  o.redPeaked = true;
  o.setup = function() {
    o.cnv = o.createCanvas(windowWidth, windowHeight);
    background(0, 0);
    o.cnv.position(0, 0);
    o.imageMode(CENTER);
    o.rectMode(CORNER);
  }
  o.opacity = 0;
  o.peak = false;
  o.draw = function() {
    o.clear();
    o.image(computer.outline, computer.location.x + computer.size.width/2,
      computer.location.y + computer.size.height/2 +33);
    if (nuclearMeltDown) {
      o.redScreenBlaring();
    }
  }
  o.redScreenBlaring = function() {
    o.push();
    o.fill(255, 0, 0, o.redOpacity);
    if (o.redPeaked && o.redOpacity < 200) {
      o.redOpacity+=4;
    } else {
      o.redOpacity -= 2;
      o.redPeaked = false;
    }
    o.rect(0, 0, o.width, o.height);
    o.pop();
    if (!o.redPeaked && o.redOpacity == 0) {
      o.redPeaked = true;
    }
  }
}
