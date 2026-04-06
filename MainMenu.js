function mainMenu(m) {
  m.preload = function() {
    preLoadFont();
  }
  m.offTitle = false;
  m.optionsWindowNeeded = false;
  m.optionsWindowExists = false;
  m.optionsWindow;

  m.setup = function() {
    loadWarGamesFont();
    m.textSize(6);
    m.strokeWeight(1);
    m.imageMode(CENTER);
    
    m.pg = m.createGraphics(750, 450, WEBGL);
    m.pg.translate(120, 0);
    m.pg.setAttributes("alpha", true);
    m.pg.noFill();
    m.pg.stroke(0, 255, 0);
    m.gl = m.pg._renderer.GL;
    
    cnv = m.createCanvas(computer.size.width,computer.size.height);
    console.log(computer.location);
    cnv.position(computer.location.x, computer.location.y);
    computer.location.set(cnv.position().x,cnv.position().y);

    //start button
    m.startButton = new Button(`START`, -175, 25, 118, 32, m);
    m.startButton.setSize(1.75);
    m.startButton.setDisplacement(1.5, 9);

    //options button
    m.options = new Button(`OPTIONS`, -175, 75, 118, 32, m);
    m.options.setSize(1.75);
    m.options.setDisplacement(0.5, 9);
    
    // dialogue
    m.dialogue = new Dialogue("test", m);
  }

  m.draw = function() {
    m.background(0);
    //m.line(m.width/3,0,m.width/3,m.height);
    //m.line(2*m.width/3,0,2*m.width/3,m.height);
    m.stroke(0, 255, 0);
    m.noFill();
    m.pg.clear();
    m.pg.push();
    m.pg.rotateX(2.2); 
    m.pg.rotateY(millis()*.0002); 
    m.pg.rotateZ(-0.28);
    m.pg.sphere(150, 18, 9);
    m.pg.pop();
    m.gl.clear(m.gl.DEPTH_BUFFER_BIT);
    
    if (!m.offTitle) {
      m.line(m.width/2 + 140, 0, m.width/2 + 140, 50);
      m.line(m.width/2 + 140, m.height - 50, m.width/2 + 140, m.height);
      m.applyMatrix(2, 0, 0, 2, m.width/2, m.height/2);
      //when resizing the text, the only way I found that worked was resizing it with scale(); However, it displaces the text, so the next best thing to would be to
      //apply a matrix that sets your desired coordinates to the origin. Now when you resize it, it doesn't displace the text.
      //Use backticks when displaying multi-line strings

      setAlignment(true);
      write(`The\nGold\nCode`, -76.5, -75, m);

      m.resetMatrix();

      m.startButton.show();
      m.options.show();

      //m.resetMatrix();
      m.image(m.pg, m.width/2, m.height/2);
    } else {
      setAlignment(false);
      /*m.applyMatrix(2, 0, 0, 2, m.width/2, m.height/2);
    write(`GAME COMING SOON! :
      )`, -150, 0, m)
        m.resetMatrix();*/
        
      canWriteDialogue = true;
      write(`<--`, 20, 40, m);
      m.dialogue.display();
    }
    if (m.optionsWindowNeeded) {
      m.optionsWindow = new p5(options);
      m.optionsWindowNeeded = false;
    }
  }

  m.mousePressed = function() {
    // Note that all numbers must be multiplied by 1.75 b/c the matrix for the rects was scaled up by x1.75 (besides width/2 and height/2 b/c they are the
    // origin of where the scaling took place!)

    if (!m.offTitle) {
      m.startButton.checkClick();
      m.options.checkClick();
      m.dialogue.curLine = 0;
    } else {
      //for the arrow
      if (m.mouseX > 20 && m.mouseX < 65 && m.mouseY > 20 && m.mouseY < 55) {
        m.offTitle = false;
      }
    }
  }
  
  m.keyPressed = function() {
    if (m.offTitle && keyCode === 13) {
      m.dialogue.nextLine();
    }
  }

  m.mouseReleased = function() {
    if (m.options.isClicking()) {
      if (!m.optionsWindowExists) {
        m.optionsWindowNeeded = true;
        m.optionsWindowExists = true;
      } else {
        m.removeOptionsWindow();
      }
    }
    m.startButton.setState(false);
    //m.options.setState(false);

    //if clicking start
    if (m.startButton.isClicking()) {
      sceneNeedsChanging = true;
      m.remove();
      switchScene(playState);
      
    }
  }

  m.removeOptionsWindow = function() {
    m.optionsWindow.remove();
    m.optionsWindowExists = false;
    m.options.setState(false); //turn off
    console.log(m.options.clickedButton);
  }
}
