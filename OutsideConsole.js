


function outsideConsole(c) {
  c.setup = function() {
    c.imageMode(CENTER);
    c.ellipseMode(CENTER);
    c.cnv = c.createCanvas(windowWidth, windowHeight);
    c.cnv.position(0,0);
    c.background(100);
    c.fill(255,0,0);

    c.strokeWeight(5);
    c.stroke(0);
    /** 
    c.beginShape();
    c.vertex(computer.location.x, computer.location.y + computer.size.y);
    
    c.vertex(computer.location.x + computer.size.x, computer.location.y + computer.size.y);
    c.vertex(0,c.height);
    c.vertex(400,400);
    c.endShape();
    **/
    c.strokeWeight(10);
    c.stroke(0,0,255);
    c.point(computer.location.x, computer.location.y + computer.size.y);

    c.circle(windowWidth/2,(windowHeight + 450)/2 + 20,125);
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
