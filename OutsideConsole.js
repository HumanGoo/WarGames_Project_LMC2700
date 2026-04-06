


function outsideConsole(c) {
  c.setup = function() {
    c.imageMode(CENTER);
    c.ellipseMode(CENTER);
    c.cnv = c.createCanvas(windowWidth, windowHeight);
    c.cnv.position(0,0);
    c.background(100);
    

    c.strokeWeight(5);
    c.stroke(0);
    
    c.fill(150);
    c.beginShape();
    c.vertex(computer.location.x, computer.location.y + computer.size.height);
    
    c.vertex(computer.location.x + computer.size.width, computer.location.y + computer.size.height);
        c.vertex(c.width,c.height);
    c.vertex(0,c.height);
    c.vertex(computer.location.x, computer.location.y + computer.size.height);
    c.endShape();
    
    c.strokeWeight(5);
    c.fill(140);
    c.ellipse(windowWidth/2,(windowHeight + 450)/2 + 55,150,120);
    c.fill(255,0,0);
    c.ellipse(windowWidth/2,(windowHeight + 450)/2 + 50,125,100);
    c.ellipse(windowWidth/2,(windowHeight + 450)/2 + 40,125,100);
  }

  c.mousePressed = function(){
    c.mouseLoc = new p5.Vector(c.mouseX,c.mouseY);
    c.buttonR = new p5.Vector(windowWidth/2,(windowHeight + 450)/2 + 40);

    if(c.mouseLoc.sub(c.buttonR).mag() < 100) {
      console.log("dd");
    }
  }
  
}

//created overlay
function overlay(o){
  o.setup = function() {
    o.cnv = o.createCanvas(windowWidth,windowHeight);
    background(0,0);
    o.cnv.position(0,0);
    o.imageMode(CENTER);
    o.image(computer.outline,computer.location.x + computer.size.width/2,
      computer.location.y + computer.size.height/2 +33);
  }
}
