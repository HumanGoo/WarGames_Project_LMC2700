let OPTIONSGENDER = false;
let OPTIONSVOLUME = 100;
function options(o) {
  o.setup = function () {
    panel = o.createCanvas(400, 300);
    //position is always in relation to the entire window's width and height
    o.gender = OPTIONSGENDER;
    o.volume = OPTIONSVOLUME;

    o.volumeHeader = new Button(`Volume: `, -190, 0, 175, 30, o);
    o.volumeHeader.setDisplacement(-30, 8);
    o.volumeSlider = o.createSlider(0, 100, OPTIONSVOLUME, 1);
    o.volumeSlider.addClass("volume-slider");

    panel.position(
      computer.location.x + currentScene.width / 2 - o.width / 2,
      computer.location.y + currentScene.height / 2 - o.height / 2,
    );
    o.volumeSlider.position(panel.x + 195, panel.y + 155);
    o.background(100, 200);

    o.exit = new Button(`X`, 220, -183, 25, 25, o);
    o.exit.setSize(0.8);
    o.exit.setDisplacement(2, 9);

    o.header = new Button(`Options`, -200, -150, 400, 25, o);
    //o.header.setSize();
    o.header.setDisplacement(0, 8);

    o.genderButton = new Button(`Your Gender`, -190, -90, 200, 30, o);
    o.genderButton.setDisplacement(-15, 9);

    o.Male = new Button(`M`, 60, -90, 50, 30, o);
    o.Male.setDisplacement(0, 9);
    o.Female = new Button(`F`, 110, -90, 50, 30, o);
    o.Female.setDisplacement(0, 9);

    o.buttonList = [o.exit, !o.gender ? o.Female : o.Male];

    o.fill(0);
    o.header.show();
    o.genderButton.show();

    o.volumeSlider.elt.addEventListener("input", function () {
      OPTIONSVOLUME = o.volumeSlider.value();
      changeVolume(OPTIONSVOLUME);
    });
  };
  o.draw = function () {
    
    o.fill(0);
    o.volumeHeader.show();
    o.exit.show();
    //gender
    if (o.gender) {
      fill(100);
    }

    o.checkGender(o.Male, !o.gender);
    o.checkGender(o.Female, o.gender);
    o.stroke(0, 255, 0);
    write(`${OPTIONSVOLUME}`, 150, 172.5, o);
    o.cursorChange();
  };

  o.mousePressed = function () {
    o.exit.checkClick();
    if (o.gender) {
      o.Male.checkClick();
    } else {
      o.Female.checkClick();
    }
  };
  o.mouseReleased = function () {
    if (o.exit.isClicking()) {
      this.remove();
      optionsButton.windowInitialized = false;
    }

    switch (o.gender) {
      case false: //male
        //switch to female
        if (o.Female.isClicking()) {
          o.Male.setState(false);
          o.gender = true;
          OPTIONSGENDER = true;
          o.buttonList[1] = o.Male;
        }
        break;
      case true: //female
        //switch to female
        if (o.Male.isClicking()) {
          o.Female.setState(false);
          o.gender = false;
          OPTIONSGENDER = false;
          o.buttonList[1] = o.Female;
        }
        break;
    }
  };

  o.checkGender = function (button, bool) {
    let tempVar = null;
    if (bool) {
      tempVar = 1;
    } else {
      o.fill(0);
    }
    button.show(tempVar);
  };

  o.genderChange = function (genderType) {
    genderType; //false => female should be clickable, true => male is clickable
  };

  o.cursorChange = function () {
    let tempVar = false;
    o.buttonList.forEach((element) => {
      if (element.isClicking()) {
        tempVar = true;
      }
    });
    if (tempVar) {
      o.cursor(HAND);
    } else {
      o.cursor(ARROW);
    }
  };
}
