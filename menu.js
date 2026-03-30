let sphere;
let clickedStart = false;
let offTitle = false;
let clickedOptions = false;

function mainMenu() {
  if (!offTitle) {
    applyMatrix(2.5,0,0,2.5,width/2,height/2);
    //when resizing the text, the only way I found that worked was resizing it with scale(); However, it displaces the text, so the next best thing to would be to
    //apply a matrix that sets your desired coordinates to the origin. Now when you resize it, it doesn't displace the text.
    //Use backticks when displaying multi-line strings
        write(`TITLE HERE`, -85, -50);
        
        resetMatrix();
        applyMatrix(1.75,0,0,1.75,width/2,height/2);
        push();
        if (clickedStart) {
          fill(0, 255, 0);
        }
        rect(-180, 75, 85, 32);
        if (clickedStart) {
          stroke(0, 0, 0);
        }
        write(`START`, -175, 100);
        pop();
        
        push();
        if (clickedOptions) {
          fill(0, 255, 0);
        }
        rect(70, 75, 118, 32);
        if (clickedOptions) {
          stroke(0, 0, 0);
        }
        write(`OPTIONS`, 75, 100);
        pop();
        
        resetMatrix();
        image(sphere, width/2 - 100, height/2 - 100 + 25, 200, 200);
  } else {
    applyMatrix(2,0,0,2,width/2,height/2);
    write(`GAME COMING SOON! :)`, -150, 0)
    
    resetMatrix();
    write(`<--`, 20, 40);
  }
  
}
