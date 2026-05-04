let dialogueChoices;
let nuclearMeltDown = false;
let givenDialogueChoices = false;
let dialogueChoicesInitialized = false;
let buttonPaths = ["Covered", "Uncovered", "Hovered", "Pressed"];
let buttonCovered = true;
let bigRedButton;
let startButton;
let optionsButton;
let creditsButton;
let onTitle = true;
let initializedEndTimer = false;
let initializedWindow = false;

function outsideConsole(c) {
  c.preload = function () {
    c.bg = loadImage("data/environment/background.png");
    c.table = loadImage("data/environment/table.png");
    c.buttons = [];

    /*
    for (let i = 0; i < buttonPaths.length; i++) {
      c.buttons.push(createImg("data/environment/button" + buttonPaths[i] + ".png"));
    }
    c.curButton = c.buttons[0];
    */
    let prefix = "data/environment/button";
    bigRedButton = new BigRedButton({
      covered: createImg(prefix + "Covered.png", "button"),
      uncovered: createImg(prefix + "Uncovered.png", "button"),
      hovered: createImg(prefix + "Hovered.png", "button"),
      pressed: createImg(prefix + "Pressed.png", "button"),
    });
    startButton = new StartButton();
    optionsButton = new MenuButton(options, `OPTIONS`, 1);
    creditsButton = new MenuButton(credits, `CREDITS`, 2);
  };

  c.setup = function () {
    c.imageMode(CENTER);
    c.ellipseMode(CENTER);
    c.cnv = c.createCanvas(WINDOWWIDTH, WINDOWHEIGHT);
    c.cnv.position(0, 0);
    console.log(c.cnv.width + " and  " + c.cnv.height);
    c.rectMode(CENTER);
  };

  c.drawMM = function () {
    bigRedButton.show();
    // startButton.show("START");
    c.showBackground();
  };

  c.drawDefault = function () {
    bigRedButton.show();
    if (givenDialogueChoices && !dialogueChoicesInitialized) {
      c.choices = [];
      dialogueChoices.forEach((elem) => {
        if (Array.isArray(elem.linkTo)) {
          if (
            allDials.includes(elem.linkTo[0]) ||
            elem.linkTo[0] == "endState" ||
            elem.linkTo[0] == "sec"
          ) {
            c.choices.push(new DialogueChoice(elem.label, elem.linkTo));
          }
        } else {
          c.choices.push(new DialogueChoice(elem.label, elem.linkTo));
        }
      });
      DialogueChoice.positionInitialized = false;
      dialogueChoicesInitialized = true;
    }
    if (DialogueChoice.hasBeenPicked || Dialogue.weAreDead) {
      c.choices.forEach((elem) => {
        elem.button.remove();
      });
      c.choices.length = 0;
      dialogueChoicesInitialized = false;
      givenDialogueChoices = false;
    }
    c.showBackground();

    if (pleaseChoose && !initializedEndTimer) {
      c.timerEnd = millis() + 15000;
      initializedEndTimer = true;
    }

    if (pleaseChoose) {
      c.push();
      c.stroke(0);
      c.fill(
        255 * (1 - (c.timerEnd - millis()) / 15000),
        255 * ((c.timerEnd - millis()) / 15000),
        0,
      );
      c.strokeWeight(5);
      c.arc(
        1350,
        150,
        200,
        200,
        3 * HALF_PI,
        3 * HALF_PI + (TWO_PI * (c.timerEnd - millis())) / 15000,
        PIE,
      );
      c.pop();

      if (millis() > c.timerEnd || nuclearMeltDown) {
        pleaseChoose = false;
        sceneNeedsChanging = true;
        if (nuclearMeltDown) {
          pushedButton = true;
        } else {
          pushedButton = false;
        }
      }
    }
  };

  c.draw = function () {
    if (onTitle) {
      c.drawMM();
    } else {
      c.drawDefault();
    }
  };

  c.mousePressed = function () {
    c.mouseLoc = new p5.Vector(c.mouseX, c.mouseY);
    c.strokeWeight(10);
    c.buttonR = new p5.Vector(
      c.windowWidth / 2,
      (c.windowHeight + 450) / 2 + 70,
    );

    /*
    
    if (!buttonCovered && c.checkButtonHover()) {
      nuclearMeltDown = true;
      buttonCovered = true;
      c.swapButton("Pressed");
    }
      */
  };

  c.mouseReleased = function () {
    /*
    if (c.curButton == c.buttons[3]) {
      c.swapButton("Uncovered");
    }
      */
  };

  /*
  c.checkButtonHover = function() {
    let butX = 915.3 - c.curButton.width;
    let butY = 769.4 - c.curButton.height
    
    if (mouseX > butX && mouseX < butX + c.curButton.width && mouseY > butY && mouseY < butY + c.curButton.height) {
      return true;
    }
    return false;
  }
  */
  c.showBackground = function () {
    /*
    if (!buttonCovered && c.checkButtonHover()) {
      c.swapButton("Hovered");
    } else if (!buttonCovered) {
      c.swapButton("Uncovered");
    }
    */
    c.background(100);
    c.strokeWeight(5);
    c.stroke(0);
    c.fill(150);

    c.image(c.bg, WINDOWWIDTH / 2, WINDOWHEIGHT / 2);
    c.image(c.table, WINDOWWIDTH / 2, WINDOWHEIGHT / 2);

    //button
    /*
    
    c.push();
    c.imageMode(CORNERS);
    c.image(c.curButton, 915.3 - c.curButton.width, 769.4 - c.curButton.height, 915.3, 769.4);
    c.pop();
    */

    if (!DialogueChoice.positionInitialized) {
      DialogueChoice.origin = new p5.Vector(350.2, 519.3);
      DialogueChoice.position.set(
        DialogueChoice.origin.x,
        DialogueChoice.origin.y,
      );
      DialogueChoice.positionInitialized = true;
    }
  };
}

//created overlay
function overlay(o) {
  o.redOpacity = 0;
  o.redPeaked = true;
  o.setup = function () {
    o.cnv = o.createCanvas(WINDOWWIDTH, WINDOWHEIGHT);
    o.cnv.style("position", "absolute");
    o.cnv.style("z-index", 20);
    o.cnv.style("pointer-events", "none");
    background(0, 0);
    o.cnv.position(0, 0);
    o.imageMode(CENTER);
    o.rectMode(CORNER);
  };
  o.opacity = 0;
  o.peak = false;
  o.draw = function () {
    try {
      if (
        !onTitle &&
        !audioFiles[5].isPlaying() &&
        getAudioContext().state == "running"
      ) {
        playSound("ambience", true);
      }
    } catch (error) {}
    o.clear();
    o.image(
      computer.outline,
      computer.location.x + computer.size.width / 2,
      computer.location.y + computer.size.height / 2 + 33,
    );
    if (nuclearMeltDown) {
      o.redScreenBlaring();
    }
  };
  o.redScreenBlaring = function () {
    try {
      if (!audioFiles[4].isPlaying()) {
        playSound("alarm", true);
      }
    } catch (error) {
      // oops!
    }

    o.push();
    o.fill(255, 0, 0, o.redOpacity);
    if (o.redPeaked && o.redOpacity < 35) {
      o.redOpacity += 1;
    } else {
      o.redOpacity -= 1;
      o.redPeaked = false;
    }
    o.rect(0, 0, o.width, o.height);
    o.pop();
    if (!o.redPeaked && o.redOpacity == 0) {
      o.redPeaked = true;
    }
  };
}

class BigRedButton {
  constructor(states) {
    //param is mapping of createIMGs()
    this.states = states;
    this.currentState = Object.keys(states)[0]; // default to first state
    Object.values(this.states).forEach((img) => {
      //console.log(img);
      img.hide();
      img.addClass("BigRedButton");
      img.mouseOver(this.hovering);
      img.mouseOut(this.noLongerHovering);
      // img.mousePressed(this.pressed);
      img.mouseReleased(this.released);
    });
    Object.values(states)[2].style("cursor: pointer");
    this.isPressed = false;
  }

  setState(stateName) {
    if (this.currentState != stateName) {
      // Hide current scene
      this.states[this.currentState].hide();
    }
    this.currentState = stateName;
  }

  show(stateName) {
    let img = this.states[this.currentState];
    // Show current state
    switch (this.currentState) {
      case "covered":
        img.position(915.3, 769.4);
        break;
      case "hovered":
        img.position(923.3, 778.4);
        break;
      case "uncovered":
        img.position(914.3, 769.75);
        break;
      case "pressed":
        img.position(914.8, 769.75);
        break;
      default:
        img.position(915.3, 769.4);
    }

    img.show();
  }

  hovering() {
    if (!buttonCovered) {
      // this.states[this.currentState].hide();
      // this.currentState = 'hovered';
      bigRedButton.setState("hovered");
    }
  }

  noLongerHovering() {
    if (!buttonCovered) {
      // this.states[this.currentState].hide();
      // this.currentState = 'uncovered';
      bigRedButton.setState("uncovered");
    }
  }

  released() {
    if (!buttonCovered) {
      bigRedButton.setState("pressed");
      buttonCovered = true;
      nuclearMeltDown = true;
      if (!initializedEndTimer) {
          currentDialogue.runDefCon1();
      }
    }
  }
}

class StartButton {
  constructor() {
    this.button = createButton(`<span class="flicker-text">${"START"}</span>`);
    this.button.addClass("start-button");
    this.wrapper = createElement("div");
    this.wrapper.addClass("start-button-parent");
    this.wrapper.elt.appendChild(this.button.elt);

    let funSkew = (9.5 + 5)/2 - (1 - ((9.5 + 5)/2 * (this.button.elt.getBoundingClientRect().width/222.3)));
    this.wrapper.style('transform:skew(' + str(-funSkew) + 'deg);');

    this.wrapper.position(
      350.2 + 222.3 / 2 - this.button.elt.getBoundingClientRect().width / 2,
      519.3 + 70 / 2 - this.wrapper.elt.offsetHeight / 2,
    );

    this.button.mouseReleased(this.whenClicked);
  }
  whenClicked = () => {
    if (!initializedWindow) {
      onTitle = false;
      this.button.hide();
      optionsButton.button.hide();
      creditsButton.button.hide();
    }
  };
}

class MenuButton {
  constructor(substate, title, buttonPos) {
    this.substate = substate;
    this.title = title;
    this.buttonPos = buttonPos;
    this.button = createButton(
      `<span class="flicker-text">${title}</span>`,
    );
    this.button.addClass("start-button");
    this.wrapper = createElement("div");
    this.wrapper.addClass("start-button-parent");
    this.wrapper.elt.appendChild(this.button.elt);

    let funSkew;
    switch (this.buttonPos) {
      case 1:
        funSkew = (4.75 + 0)/2 - (1 - ((4.75 + 0)/2 * (this.button.elt.getBoundingClientRect().width/216.4)));
        
        this.wrapper.style('transform:skew(' + str(-funSkew) + 'deg);');
        this.wrapper.position(557.9 + 216.4/2 - this.button.elt.getBoundingClientRect().width/2, 519.3 + (70/2 - this.wrapper.elt.offsetHeight/2));
        break;
      case 2:
        funSkew = (0 + -4.75)/2 - (1 - ((0 + -4.75)/2 * (this.button.elt.getBoundingClientRect().width/216.4)));
        
        this.wrapper.style('transform:skew(' + str(-funSkew) + 'deg);');
        this.wrapper.position(785.5 + 216.4/2 - this.button.elt.getBoundingClientRect().width/2, 519.3 + (70/2 - this.wrapper.elt.offsetHeight/2));
        break;
      case 3:
        funSkew = (-5 + -9.5)/2 - (1 - ((-5 + -9.5)/2 * (this.button.elt.getBoundingClientRect().width/222.3)));
        
        this.wrapper.style('transform:skew(' + str(-funSkew) + 'deg);');
        this.wrapper.position(1027.3 + 222.3/2 - this.button.elt.getBoundingClientRect().width/2, 519.3 + (70/2 - this.wrapper.elt.offsetHeight/2));
        break;
      default:
        funSkew = (9.5 + 5)/2 - (1 - ((9.5 + 5)/2 * (this.button.elt.getBoundingClientRect().width/222.3)));
        
        this.wrapper.style('transform:skew(' + str(-funSkew) + 'deg);');
        this.wrapper.position(350.2 + 222.3/2 - this.button.elt.getBoundingClientRect().width/2, 519.3 + (70/2 - this.wrapper.elt.offsetHeight/2));
        break;
    }

    this.button.mouseReleased(this.whenClicked);
  }
  whenClicked = () => {
    if (!initializedWindow) {
      this.window = new p5(this.substate);
      initializedWindow = true;
      creditsButton.button.elt.disabled = true;
      startButton.button.elt.disabled = true;
      optionsButton.button.elt.disabled = true;
    }
  };
}
