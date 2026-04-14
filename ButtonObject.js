class Button {
  constructor(label, locX, locY, bWidth, bHeight, parentCanvas) {
    this.pointA = new p5.Vector(locX, locY);

    this.center = new p5.Vector(locX, locY);

  this.dim = {width:
  bWidth, height:
    bHeight
  };
  this.label = label;
  /**
   * @var {boolean} the state of the button; whether or not it is being clicked or not.
   */
  this.clickedButton = false;

  this.parentCanvas = parentCanvas;
  if (this.parentCanvas == null) {
    throw new Error("**Parent Canvas not stated as parameter!**");
  }
  this.size = 1;
  this.baseColor = color(0, 255, 0);
  this.highlight = color(0, 0, 0);
  this.textDisplacement = new p5.Vector(0, 0);
  
  console.log('created ' + label + ' button');
}
/**
 * displays the button object. Due to the properties of applyMatrix, can only be invoked in the draw function
 */
show() {
  let e = this.parentCanvas;
  e.applyMatrix(this.size, 0, 0, this.size, this.parentCanvas.width/2, this.parentCanvas.height/2);
  e.push();
  e.stroke(this.baseColor);
  if (this.clickedButton) {
    e.fill(this.baseColor);
  }
  e.rect(this.pointA.x, this.pointA.y, this.dim.width, this.dim.height);
  if (this.clickedButton) {
    e.stroke(this.highlight);
  }
  write(this.label, (this.pointA.x + this.dim.width/2) + this.textDisplacement.x,
    (this.pointA.y + this.dim.height/2) + this.textDisplacement.y, e);
  e.pop();
  e.resetMatrix();
}
/**
 * changes the clickedButton property
 * @param {boolean} bool true => is being clicked; false otherwise
 */
setState(bool) {
  this.clickedButton = bool;
}
setSize(newSize) {
  this.size = newSize;
}
setDisplacement(x, y) {
  this.textDisplacement.set(x, y);
}
//-180, 75
isClicking() {
  let e = this.parentCanvas;
  let displace = this.size;
  let x = this.pointA.x * displace;
  let y = this.pointA.y * displace;

  return e.mouseX > (e.width/2 + x) && e.mouseX < (e.width/2 + (x)) + (this.dim.width*displace) && e.mouseY > e.height/2 + (y) && e.mouseY < (e.height/2 + (y)) + (this.dim.height*displace);
}

checkClick() {
  if (this.isClicking()) {
    this.setState(true);
    dialStart = millis();
    console.log("clicked " + this.label);
  }
}
}
