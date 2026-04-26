let skippedLine = false;

function playState(p) {
  p.startedRingSound = false;
  p.someoneIsCalling = true;
  p.inDialogue = false;
  p.mousePos = new p5.Vector(0, 0);
  p.preload = function() {
    p.phone = p.loadImage('data/phone.png');
    // p.guy = p.loadImage('data/guytemplate.png');
    //load other people images
  p.timerStart = 0;
  p.timerEnd = 0;
  }
  p.setup = function() {
    sceneNeedsChanging = false;
    userStartAudio();
    
    currentDialogue = secretaryDial;

    canvas = p.createCanvas(computer.size.width, computer.size.height);
    canvas.position(computer.location.x, computer.location.y);

    p.imageMode(CENTER)
      p.image(p.phone, computer.size.width/2, computer.size.height/2);
    p.ellipseMode(RADIUS);

    loadOverlay();
  }
  p.draw = function() {
    p.background(0);
    if (p.someoneIsCalling) {
      //console.log("ring");
      p.incomingCall();
    } else {
        p.displayCaller(p.newDialogue.pic);
      if (p.newDialogue.canDisplay) {
        p.newDialogue.display();
      }
    }
    
    if (sceneNeedsChanging) {
      p.remove();
      switchScene(endState);
      sceneNeedsChanging = false;
    }
  }

  p.incomingCall = function() {
    if(!p.callExists){p.callExists = true;}
    p.applyMatrix(1, 0, 0, 1, computer.size.width/2, computer.size.height/2);
    p.push();
    if (p.frameCount % 10 == 0) {
      p.angle =  .02;
    } else {
      p.angle = -.02;
    }

    p.rotate(p.angle);

    p.image(p.phone, 0, 0);
    p.pop();
    
    p.opacity = 150;

    if (p.someoneIsCalling && p.callExists && p.checkCall()) {
      p.opacity = 225;
      // console.log("hovering over call");
      p.cursor(HAND);
    } else {
      p.cursor(ARROW);
    }

    p.push();
    p.stroke(0);
    p.fill(255, 10, 10, p.opacity);
    p.circle(0, 0, 100);
    p.noStroke();
    p.fill(255, p.opacity);
    p.circle(0, 75 - 10, 25);
    p.triangle(0, 75-10-30, 40, -75 + 10, -40, -75 + 10);
    p.pop();

    p.resetMatrix();
try{
    if (!audioFiles[2].isPlaying()) {
      playSound("phoneRing", true);
    }
  }
  catch{}

  }
  p.pickupPhone = function() {
      stopSound("phoneRing");
      playSound("phonePickUp", false);
    
      //console.log(currentDialogue);
      p.makeNewDialogue();
      p.someoneIsCalling = false;
      p.inDialogue = true;
      p.newDialogue.canDisplay = true;
      p.callExists = false;
      p.startedRingSound = false;
      
      dialStart = millis();
  }

  p.checkCall = function() {
    p.buttonLoc = new p5.Vector(computer.size.width/2, computer.size.height/2);
    p.mousePos = new p5.Vector(p.mouseX, p.mouseY);
    // console.log(p5.Vector.sub(p.mousePos, p.buttonLoc));
    return p5.Vector.sub(p.mousePos, p.buttonLoc).mag() < 100;
    // return p.mousePos.sub(p.buttonLoc).mag() < 100;
  }

  p.mousePressed = function() {
    p.mousePos.set(p.mouseX, p.mouseY);
    //happens once
    if (!p.someoneIsCalling && !p.newDialogue.canClose && p.newDialogue.isInsideBox() && p.inDialogue && p.newDialogue.delay) {
      if (!finishedLine) {
        skippedLine = true;
      } else {
        p.newDialogue.nextLine();
        skippedLine = false;
      }
    }
    if (p.checkCall() && p.someoneIsCalling && p.callExists) {
      p.pickupPhone();
    }
    p.cursor(ARROW);
  }

  p.keyPressed = function() {
    if (p.inDialogue && (keyCode === 13 || keyCode === 32)) {
      if (!finishedLine) {
        skippedLine = true;
      } else {
        p.newDialogue.nextLine();
        skippedLine = false;
      }
    }
  }

  p.makeNewDialogue = () => {
    let curBranch = Dialogue.currentBranchIndex;
    // console.log(curBranch);
    
    currentDialogue.setParentCanvas(p);
    p.newDialogue = currentDialogue;
    // p.newDialogue.currentBranchingIndex = curBranch;
    p.newDialogue.resetDial();
    p.newDialogue.canDisplay = true;
  }

  p.displayCaller = function(dude) {
      p.tint(0, 255, 0, 255);
      p.image(dude, computer.size.width/2, computer.size.height/2);
  }
}
