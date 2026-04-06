function playState(p) {
  p.someoneIsCalling = true;
  p.inDialogue = false;
  
  p.preload = function() {
    p.phone = p.loadImage('data/phone.png');
    p.guy = p.loadImage('data/guytemplate.png');
    //load other people images
  }
  p.setup = function(){
    
    canvas = p.createCanvas(computer.size.width,computer.size.height);
    canvas.position(computer.location.x,computer.location.y);
    
    p.imageMode(CENTER)
    p.image(p.phone,computer.size.width/2,computer.size.height/2);
    p.ellipseMode(RADIUS);

    p.newDialogue = new Dialogue("test", p);
    loadOverlay();
  }
  p.draw = function(){
    p.background(0);
    if(p.someoneIsCalling){
    p.incomingCall();
    } else {
      p.pickupPhone();
      p.tint(0, 255, 0, 255);
      p.image(p.guy,computer.size.width/2,computer.size.height/2);

      p.newDialogue.display();
    }
  }
  p.incomingCall = function(){
    p.applyMatrix(1, 0, 0, 1, computer.size.width/2,computer.size.height/2);
    p.push();
    if (p.frameCount % 10 == 0) {
      p.angle =  .02;
    } else {
      p.angle = -.02;
    }
    
    p.rotate(p.angle);
    
    p.image(p.phone,0,0);
    p.pop();
    p.opacity = 150;

    if(p.checkCall()){
      p.opacity = 225;
    }
      
    p.push();
    p.fill(255,10,10,p.opacity);
    p.circle(0, 0, 100);
    p.noStroke();
    p.fill(255,p.opacity);
    p.circle(0,75 - 10,25);
    p.triangle(0, 75-10-30, 40, -75 + 10, -40, -75 + 10);
    p.pop();
    
    p.resetMatrix();
  }
  p.pickupPhone = function(){
    //check who is calling based on other flags
    //set that person to the p.personCalling property
    p.personCalling;
  }

  p.checkCall = function(){
    p.mousePos = new p5.Vector(p.mouseX,p.mouseY);
    p.buttonLoc = new p5.Vector(computer.size.width/2,computer.size.height/2);

    return p.mousePos.sub(p.buttonLoc).mag() < 100;
  }

  p.mousePressed = function(){
    if(p.checkCall()){
      console.log("sdfsdf");
      p.someoneIsCalling = false;
      p.inDialogue = true;
      dialStart = millis();
    }
  }
  
  p.keyPressed = function() {
    if (p.inDialogue && keyCode === 13) {
      p.newDialogue.nextLine();
    }
  }
}
