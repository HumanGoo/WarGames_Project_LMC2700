function credits(c) {
  c.preload = function() {
    c.credImage = c.loadImage('data/credits.png');
  }
  
  c.setup = function() {
    panel = c.createCanvas(600, 300);
    
    panel.position(
      computer.location.x + currentScene.width / 2 - c.width / 2,
      computer.location.y + currentScene.height / 2 - c.height / 2,
    );
    
    c.exit = new Button(`X`, 345, -184, 25, 25, c);
    c.exit.setSize(0.8);
    c.exit.setDisplacement(2, 9);

    c.header = new Button(`Credits`, -300, -150, 600, 25, c);
    //o.header.setSize();
    c.header.setDisplacement(0, 8);
    
    c.fill(0);
    c.header.show();
  }
  
  c.draw = function() {
    c.image(c.credImage, 0, 25);
    c.exit.show();
    
    c.stroke(0, 255, 0);
    c.noFill();
    c.strokeWeight(1);
    c.rect(0, 0, 600, 300);
    
    c.cursorChange();
  }
  
  c.mousePressed = function() {
    c.exit.checkClick();
  }
  
  c.mouseReleased = function() {
    if (c.exit.isClicking()) {
      this.remove();
      initializedWindow = false;
      optionsButton.button.elt.disabled = false;
      startButton.button.elt.disabled = false;
      creditsButton.button.elt.disabled = false;
    }
  }
  
  c.cursorChange = function () {
    let tempVar = false;
    if (c.exit.isClicking()) {
      tempVar = true;
    }
    
    if (tempVar) {
      c.cursor(HAND);
    } else {
      c.cursor(ARROW);
    }
  };
}
