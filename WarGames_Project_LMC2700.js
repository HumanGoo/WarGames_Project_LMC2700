function preload() {
  preLoadFont();
}
function setup() {
  createCanvas(800, 500);
  loadWarGamesFont();
textSize(6);
strokeWeight(1);

}
function draw() {
    applyMatrix(1.6,0,0,1.6,width/2,height/2);
  background(0);
  stroke(0, 255, 0);
  //when resizing the text, the only way I found that worked was resizing it with scale(); However, it displaces the text, so the next best thing to would be to
  //apply a matrix that sets your desired coordinates to the origin. Now when you resize it, it doesn't displace the text.
  //Use backticks when displaying multi-line strings
      write(`hey vro`, 0, 0, 25);

}
