function endState(e) {
  e.playerClicked = pushedButton;
  e.botClicked = round(random());
  
  e.topTextStr = "";
  e.descTextStr = "";
  e.descTextStr2 = "";
  
  e.setup = function() {
    sceneNeedsChanging = false;
    
    canvas = e.createCanvas(computer.size.width, computer.size.height);
    canvas.position(computer.location.x, computer.location.y);
    
    e.imageMode(CENTER);
    e.ellipseMode(RADIUS);
    e.noFill();
    
    e.resetButton = new Button(`RESET`, -50, 70, 100, 40, e);
    e.resetButton.setSize(1.75);
    e.resetButton.setDisplacement(1.5, 9);
    
    e.getEnding();
    
    loadOverlay();
  }
  
  e.getEnding = function() {
    if (e.playerClicked && e.botClicked || e.botClicked && !e.playerClicked) {
      e.topTextStr = "You Lose...";
    } else {
      e.topTextStr = "You Win!"
    }
    
    if (e.playerClicked) {
      if (e.botClicked) {
        e.descTextStr = `Mutually Assured Destruction`;
        e.descTextStr2 = `The world has ended...`;
      } else {
        e.descTextStr = `You defeated your enemy!`;
        e.descTextStr2 = `This is a good ending, right?`;
      }
    } else {
      if (e.botClicked) {
        e.descTextStr = `You were defeated by the enemy.`;
        e.descTextStr2 = `Your country no longer exists...`;
      } else {
        e.descTextStr = `World Peace`;
        e.descTextStr2 = `It\'s all sunshine and rainbows here!`;
      }
    }
  }
  
  e.draw = function() {
    e.background(0);
    e.stroke(0, 255, 0);
    setAlignment(true);
    // e.strokeWeight(300);
    
    e.applyMatrix(2.5, 0, 0, 2.5, e.width/2, e.height/2);
    write(e.topTextStr, -5, -25, e);
    
    e.resetMatrix();
    e.translate(e.width/2, e.height/2);
    write(e.descTextStr, -30, 40, e);
    write(e.descTextStr2, -40, 90, e);
    
    e.resetMatrix();
    
    e.resetButton.show();
  }
  
  e.mousePressed = function() {
    e.resetButton.checkClick();
  }
  
  e.mouseReleased = function() {
    if (e.resetButton.isClicking()) {
      sceneNeedsChanging = true;
      allDials = ["cong", "press", "ceo", "lead"];
      Dialogue.currentBranchIndex = 0;
      initializeDialogues();
      e.remove();
      switchScene(mainMenu);
    }
  }
}
