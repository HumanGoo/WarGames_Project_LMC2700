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
    cnv = m.createCanvas(computer.size.width,computer.size.height);
    console.log(computer.location);
    cnv.position(computer.location.x, computer.location.y);
    computer.location.set(cnv.position().x,cnv.position().y);
    m.pg = m.createGraphics(220, 220, WEBGL);
    m.pg.noFill();
    m.pg.stroke(0, 255, 0);
    m.gl = m.pg._renderer.GL;

    //start button
    m.startButton = new Button(`START`, -189.5, 75, 118, 32, m);
    m.startButton.setSize(1.75);
    m.startButton.setDisplacement(1.5, 9);

    //options button
    m.options = new Button(`OPTIONS`, 71.5, 75, 118, 32, m);
    m.options.setSize(1.75);
    m.options.setDisplacement(0.5, 9);
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
    m.pg.rotateZ(-0.28);
    m.pg.rotateY(millis()*.0002);
    m.pg.sphere(90, 18, 9);
    m.pg.pop();
    m.gl.clearDepth(1);
    m.gl.clear(m.gl.DEPTH_BUFFER_BIT);

    if (!m.offTitle) {
      m.line(m.width/2, 0, m.width/2, m.height);
      m.applyMatrix(2.5, 0, 0, 2.5, m.width/2, m.height/2);
      //when resizing the text, the only way I found that worked was resizing it with scale(); However, it displaces the text, so the next best thing to would be to
      //apply a matrix that sets your desired coordinates to the origin. Now when you resize it, it doesn't displace the text.
      //Use backticks when displaying multi-line strings

      setAlignment(true);
      write(`The Gold Code`, -22, -50, m);

      m.resetMatrix();

      m.startButton.show();
      m.options.show();

      //m.resetMatrix();
      m.image(m.pg, m.width/2, m.height/2);
    } else {
      m.applyMatrix(2, 0, 0, 2, m.width/2, m.height/2);
      setAlignment(false);
    write(`GAME COMING SOON! :
      )`, -150, 0, m)
        m.resetMatrix();
      write(`<--`, 20, 40, m);
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
    } else {
      //for the arrow
      if (m.mouseX > 20 && m.mouseX < 65 && m.mouseY > 20 && m.mouseY < 55) {
        m.offTitle = false;
      }
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
      m.offTitle = true;
      sceneNeedsChanging = true;
      //m.remove();
    }
  }

  m.removeOptionsWindow = function() {
    m.optionsWindow.remove();
    m.optionsWindowExists = false;
    m.options.setState(false); //turn off
    console.log(m.options.clickedButton);
  }
}
