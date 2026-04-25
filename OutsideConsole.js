let dialogueChoices;
let nuclearMeltDown = false;
let givenDialogueChoices = false;
let dialogueChoicesInitialized = false;
let choiceWidth = 0;
let buttonPaths = ["Covered", "Uncovered", "Hovered", "Pressed"];
let buttonCovered = true;

function outsideConsole(c) {
  c.preload = function() {
    c.bg = loadImage("data/environment/background.png");
    c.table = loadImage("data/environment/table.png");
    c.buttons = [];
    
    for (let i = 0; i < buttonPaths.length; i++) {
      c.buttons.push(loadImage("data/environment/button" + buttonPaths[i] + ".png"));
    }
    c.curButton = c.buttons[0];
  }
  
  c.setup = function() {
    c.imageMode(CENTER);
    c.ellipseMode(CENTER);
    c.cnv = c.createCanvas(WINDOWWIDTH, WINDOWHEIGHT);
    c.cnv.position(0, 0);
    console.log(c.cnv.width + " and  " + c.cnv.height);
    c.rectMode(CENTER);
  }
  
  c.draw = function() {
    if (givenDialogueChoices && !dialogueChoicesInitialized) {
      c.choices = [];
      dialogueChoices.forEach(elem => {
        if (Array.isArray(elem.linkTo)) {
            if (allDials.includes(elem.linkTo[0]) || elem.linkTo[0] == "endState" || elem.linkTo[0] == "sec") {
              c.choices.push(new DialogueChoice(elem.label, elem.linkTo));
            }
          } else {
            c.choices.push(new DialogueChoice(elem.label, elem.linkTo));
          }
      });
      DialogueChoice.positionInitialized = false;
      dialogueChoicesInitialized = true;
    }
    if (DialogueChoice.hasBeenPicked) {
      c.choices.forEach(elem => {
        elem.button.remove()
      }
      )
      c.choices.length = 0;
      dialogueChoicesInitialized = false;
      givenDialogueChoices = false;
      choiceWidth = 0;
    }
    c.showBackground();
  }
  
  c.swapButton = function(button) {
    if (c.buttons.includes(button)) {
      c.curButton = c.buttons.indexOf(button);
    }
  }

  c.mousePressed = function() {
    c.mouseLoc = new p5.Vector(c.mouseX, c.mouseY);
    c.strokeWeight(10);
    c.buttonR = new p5.Vector(c.windowWidth/2, (c.windowHeight + 450)/2 + 70);

    /*if (c.mouseLoc.sub(c.buttonR).mag() < 60) {
      console.log("hello")
        nuclearMeltDown = true;
    }*/
    
    if (!buttonCovered && c.checkButtonHover()) {
      nuclearMeltDown = true;
      buttonCovered = true;
      c.swapButton("Pressed");
    }
  }
  
  c.mouseReleased = function() {
    if (c.curButton == c.buttons[3]) {
      c.swapButton("Uncovered");
    }
  }
  
  c.checkButtonHover = function() {
    let butX = 915.3 - c.curButton.width;
    let butY = 769.4 - c.curButton.height
    
    if (mouseX > butX && mouseX < butX + c.curButton.width && mouseY > butY && mouseY < butY + c.curButton.height) {
      return true;
    }
    return false;
  }

  c.showBackground = function() {
    
    if (!buttonCovered && c.checkButtonHover()) {
      c.swapButton("Hovered");
    } else if (!buttonCovered) {
      c.swapButton("Uncovered");
    }
    
    c.background(100);
    c.strokeWeight(5);
    c.stroke(0);
    c.fill(150);
    
    c.image(c.bg, WINDOWWIDTH/2, WINDOWHEIGHT/2);
    c.image(c.table, WINDOWWIDTH/2, WINDOWHEIGHT/2);
    
    
    //table
    
    /*c.beginShape();
    c.vertex(computer.location.x, computer.location.y + computer.size.height);
    c.vertex(computer.location.x + computer.size.width, computer.location.y + computer.size.height);
    c.vertex(c.width, c.height);
    c.vertex(0, c.height);
    c.vertex(computer.location.x, computer.location.y + computer.size.height);
    c.endShape();*/
    //button

    /*c.strokeWeight(5);
    c.fill(140);
    c.ellipse(c.width/2, (c.height + 450)/2 + 85, 150, 120);
    c.fill(255, 0, 0);
    c.ellipse(c.width/2, (c.height + 450)/2 + 80, 125, 100);
    c.ellipse(c.width/2, (c.height + 450)/2 + 70, 125, 100);*/
    
    c.push();
    c.imageMode(CORNERS);
    c.image(c.curButton, 915.3 - c.curButton.width, 769.4 - c.curButton.height, 915.3, 769.4);
    c.pop();
    
    if(!DialogueChoice.positionInitialized) {
      DialogueChoice.origin = new p5.Vector(346.5, 520);
      DialogueChoice.position.set(DialogueChoice.origin.x, DialogueChoice.origin.y);
      // DialogueChoice.positionInitialized = true;
    }

    /*
    //button cover

    c.fill(80,100);
    
    c.rect(c.width/2, (c.height + 445)/2 + 85, 180, 145);
    c.rect(c.width/2, (c.height + 400)/2 + 85, 180, 145);
    
    c.rect(c.width/2, (c.height + 305)/2 + 85, 180, 7.5);
    c.rect(c.width/2, (c.height + 415)/2 + 85, 180, 120);
    c.rect(c.width/2, (c.height + 555)/2 + 85, 180, 22.5);
    c.fill(110)
    c.ellipse(c.width/2 + 95, (c.height + 445)/2 + 85, 10, 145);
    */
  }
}


//created overlay
function overlay(o) {
  o.redOpacity = 0;
  o.redPeaked = true;
  o.setup = function() {
    o.cnv = o.createCanvas(WINDOWWIDTH, WINDOWHEIGHT);
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
