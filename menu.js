
function mainMenu(m) {
  m.preload = function(){
  preLoadFont();
  }
  m.clickedStart = false;
  m.offTitle = false;
  m.clickedOptions = false;
  m.setup = function() {
    loadWarGamesFont();
    m.textSize(6);
    m.strokeWeight(1);
    m.imageMode(CENTER);
    m.createCanvas(800, 500);
    m.pg = m.createGraphics(220, 220, WEBGL);
    m.pg.noFill();
    m.pg.stroke(0, 255, 0);
    m.gl = m.pg._renderer.GL;
  }

  m.draw = function() {
    m.background(0);
    m.stroke(0, 255, 0);
    m.noFill();
    m.pg.clear();
    m.pg.push();
    m.pg.rotateX(2.2);
    m.pg.rotateZ(-0.28);
    m.pg.rotateY(millis()*.0005);

    m.pg.sphere(90, 18, 9);
    m.pg.pop();
    m.gl.clearDepth(1);
    m.gl.clear(m.gl.DEPTH_BUFFER_BIT);

    if (!m.offTitle) {
      m.applyMatrix(2.5, 0, 0, 2.5, m.width/2, m.height/2);
      //when resizing the text, the only way I found that worked was resizing it with scale(); However, it displaces the text, so the next best thing to would be to
      //apply a matrix that sets your desired coordinates to the origin. Now when you resize it, it doesn't displace the text.
      //Use backticks when displaying multi-line strings

      write(`TITLE HERE`, -85, -50,m);
      
      m.resetMatrix();
      m.applyMatrix(1.75, 0, 0, 1.75, m.width/2, m.height/2);
      m.push();
      if (m.clickedStart) {
        m.fill(0, 255, 0);
      }
      m.rect(-180, 75, 85, 32);
      if (m.clickedStart) {
        m.stroke(0, 0, 0);
      }
      write(`START`, -175, 100,m);
      m.pop();

      m.push();
      if (m.clickedOptions) {
        m.fill(0, 255, 0);
      }
      m.rect(70, 75, 118, 32);
      if (m.clickedOptions) {
        m.stroke(0, 0, 0);
      }
      write(`OPTIONS`, 75, 100,m);
      m.pop();

      m.resetMatrix();
      m.image(m.pg, m.width/2, m.height/2);
    } else {
      m.applyMatrix(2, 0, 0, 2, m.width/2, m.height/2);
      write(`GAME COMING SOON! :)`, -150, 0, m)

      m.resetMatrix();
      write(`<--`, 20, 40, m);
    }
  }

  m.mousePressed = function() {
    // Note that all numbers must be multiplied by 1.75 b/c the matrix for the rects was scaled up by x1.75 (besides width/2 and height/2 b/c they are the
    // origin of where the scaling took place!)
    if (!m.offTitle) {
      if (m.mouseX > m.width/2 - (180*1.75) && m.mouseX < (m.width/2 - (180*1.75)) + 85*1.75 && m.mouseY > m.height/2 + (75*1.75) && m.mouseY < (m.height/2 + (75*1.75)) + 32*1.75) {
        m.clickedStart = true;
        console.log("clicked start");
      }
      if (m.mouseX > m.width/2 + (70*1.75) && m.mouseX < (m.width/2 + (70*1.75)) + 118*1.75 && m.mouseY > m.height/2 + (75*1.75) && m.mouseY < (m.height/2 + (75*1.75)) + 32*1.75) {
        m.clickedOptions = true;
        console.log("clicked options");
      }
    } else {
      if (m.mouseX > 20 && m.mouseX < 65 && m.mouseY > 20 && m.mouseY < 55) {
        m.offTitle = false;
      }
    }
  }

  m.mouseReleased = function() {
    m.clickedStart = false;
    m.clickedOptions = false;
    if (m.mouseX > m.width/2 - (180*1.75) && m.mouseX < (m.width/2 - (180*1.75)) + 85*1.75 && m.mouseY > m.height/2 + (75*1.75) && m.mouseY < (m.height/2 + (75*1.75)) + 32*1.75) {
      m.offTitle = true;
      sceneNeedsChanging = true;
      //m.remove();
    }
  }
}
