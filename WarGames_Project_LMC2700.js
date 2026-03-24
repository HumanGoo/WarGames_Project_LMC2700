function preload() {
  preLoadFont();
}
function setup() {
  createCanvas(800, 500);
  loadWarGamesFont();
}
function draw() {
  background(0);
  stroke(0, 255, 0);

  writeStream("ni hao fine shyt", 80, 420, 25);
}
