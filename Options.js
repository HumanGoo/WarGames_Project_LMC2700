let OPTIONSGENDER;
let OPTIONSVOLUME;
function options(o) {
  o.setup = function() {
    panel = o.createCanvas(400, 300);
    //position is always in relation to the entire window's width and height

    panel.position(computer.location.x + currentScene.width/2 - o.width/2, computer.location.y
      + currentScene.height/2 - o.height/2);
    o.background(100, 150);

    o.exit = new Button(`X`, 220, -183, 25, 25, o);
    o.exit.setSize(0.8);
    o.exit.setDisplacement(2, 9);

    o.header = new Button(`options`, -200, -150, 400, 25, o);
    //o.header.setSize();
    o.header.setDisplacement(0, 8);
  }
  o.draw = function() {
    o.header.show();
    o.exit.show();
  }

  o.mousePressed = function() {
    o.exit.checkClick();
  }
  o.mouseReleased = function() {
    if (o.exit.isClicking()) {
      currentScene.removeOptionsWindow();
    }
  }
}
