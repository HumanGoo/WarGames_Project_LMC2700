let allDials = ["cong", "press", "ceo", "lead"];
let playerAlignment = 0;
let talkedToPress = false;
let pleaseChoose = false;

/*
Everything needed for dialogue to work properly
*/
class Dialogue {
  static currentBranchIndex = 0;
    static rudeToPress = 0; //0 => neutral end, 1 => good end, 2 => bad
    static weAreDead = false;
  constructor(file, name = null) {
    this.id = name;
    this.json = file;
    this.parentCanvas = null;
    this.deadYet = false;
    this.dial = this.json["dialogue"][Dialogue.currentBranchIndex]["text"];
    this.canBranch =
      this.json["dialogue"][Dialogue.currentBranchIndex]["branching"];
    if (this.canBranch == undefined) {
      this.canBranch = false;
    }
    this.name = this.json["id"];
    this.curLine = 0;
    this.canClose = false;
    this.canDisplay = true;
    this.closingTimer = 0;
    this.picPath = "data/" + this.json["pic"];
    this.pic = loadImage(this.picPath);

    this.delay = false;

    this.linkToNext = {};
  }

  display() {
    let e = this.parentCanvas;
    let boxWidth = e.width - 100 - (millis() - this.closingTimer) * 5;
    e.fill(0, 200);
    e.stroke(0, 255, 0);

    if (!this.canClose) {
      e.rect(
        this.cornerPoint.x,
        this.cornerPoint.y,
        this.size.width,
        this.size.height,
      );
      e.noFill();

      let dialogueLine = this.dial[this.curLine];
      if (OPTIONSGENDER) {
        dialogueLine = dialogueLine.replace("Mr.","Ms.");
        dialogueLine = dialogueLine.replace("sir", "ma'am");
      }
      setAlignment(false);
      write(this.name, 75, e.height - 145, e);
      writeStream(dialogueLine, 85, e.height - 113, 25, e);
      if (
        this.parentCanvas.focused &&
        !audioFiles[3].isPlaying() &&
        !finishedLine
      ) {
        playSound("talk", true, true);
      }
      if (audioFiles[3].isPlaying()) {
        setSoundPitch("talk", true, this.json["pitch"]);
      }
      setAlignment(true);
    } else if (!this.canBranch) {
      //closes the window
      playSound("phoneHangUp", false);
      if (boxWidth > 0) {
        e.rect(e.width / 2 - boxWidth / 2, e.height - 175, boxWidth, 150);
      } else {
        this.canDisplay = false;
        if(Dialogue.weAreDead && !this.deadYet) {
          this.deadYet = true;
          pushedButton = true;
          sceneNeedsChanging = true;
        }
      }
    }
    if (this.paths == undefined && this.canBranch) {
      this.paths = this.json["dialogue"][this.getIndexInJSON()]["links"];
      //console.log(this.paths);
      dialogueChoices = this.paths;
    }

    this.delay = true;
  }

// Calls next line of dialogue or begins branching if needed
  nextLine() {
    let atEndDial = this.json["dialogue"][this.getIndexInJSON()]["id"] == "will_you_press_the_button" || this.json["dialogue"][this.getIndexInJSON()]["id"].startsWith("after_leader");
    console.log(atEndDial);
    
    stopSound("talk");
    // console.log("to next line");
    if (this.curLine + 1 < this.dial.length) {
      this.curLine++;
      dialStart = millis();
      
      if (this.curLine + 1 == this.dial.length && atEndDial) {
        pleaseChoose = true;
      }
    } else if (!this.canBranch && !atEndDial) {
      this.canClose = true;
      this.closingTimer = millis();
    }
    if (this.curLine + 1 == this.dial.length && this.canBranch) {
      givenDialogueChoices = true;
    }
    if (!atEndDial) {
      this.delay = false;
      finishedLine = false;
    }
  }

  isInsideBox() {
    let mouseVector = new p5.Vector(
      this.parentCanvas.mouseX,
      this.parentCanvas.mouseY,
    );
    point = this.cornerPoint;
    return (
      mouseVector.x < this.parentCanvas.width &&
      mouseVector.x > 0 &&
      mouseVector.y > 0 &&
      mouseVector.y < this.parentCanvas.height
    );
  }
  
  // Since "index" doesn't equal the actual index of an array
  getIndexInJSON() {
    for (let i = 0; i < this.json["dialogue"].length; i++) {
      if (this.json["dialogue"][i]["index"] == Dialogue.currentBranchIndex) {
        return i;
      }
    }
  }

  // Switches from one dialogue file to another or simply moves between dialogue from the same character
  branchDialoguePaths(index) {
    //check if array
    //if so, index 0 is the file name we path to
    //index 1 is the index we set it to be.

    if (index == "checkLinks") { //secretary dialogue code
      //also array, or something
      if (allDials[0] == "sec") {
        Dialogue.currentBranchIndex = 2; //endstate
      } else {
        /*
        this is where the branching paths based on your alignment and whether or not you talk to the press.
        */
        if (playerAlignment == 0) { //neutral
            Dialogue.currentBranchIndex = talkedToPress ? 6 : 5;
        } else if (playerAlignment > 0) { //good
            Dialogue.currentBranchIndex = talkedToPress ? 9 : (playerAlignment > 1 ? 8 : 5);
        } else if (playerAlignment < 0) { //bad
            console.log('hello you are bad')
            // DialogueChoice.currentBranchIndex = talkedToPress ? 10 : 11;
            Dialogue.currentBranchIndex = talkedToPress ? 11 : 10;
        }
      }
      this.resetDial();
      return;
    }
    if (typeof index === "object") { //going into other json file
      //array
    //check alignment
      let currentBranchId =
        this.json["dialogue"][this.getIndexInJSON()]["id"];
      switch(currentBranchId) {
        case "bad end":
            playerAlignment--;
            break;
        case "neutral end":
            if(playerAlignment < 0) {
                playerAlignment++;
            } else if (playerAlignment > 0) {
                playerAlignment--;
            }
            break;
        case "good end":
            playerAlignment++;
            break;
      }

      index[0] = index[0].trim();
      if (index[0] == "endState") {
        pushedButton = boolean(index[1]);
        sceneNeedsChanging = true;
      } else {
        //index only
        console.log("sending you to: " + index);
        let newDest = this.searchFor(index[0]);
        console.log(newDest);
        if (allDials.includes(index[0])) {
          //checks if the person we talked to is in allDials
          if (index[0] === "press") {
            talkedToPress = true;
          }
          allDials.splice(allDials.indexOf(index[0]), 1); //removing
        }
        if (allDials.length == 0) {
          //if allDials is empty
          allDials.push("sec"); //default to secretary
          newDest.setNewLinks([secretaryDial]);
        } else {
          newDest.setNewLinks([
            secretaryDial,
            pressDial,
            congressDial,
            ceoDial,
            leaderDial,
          ]);
        }
        currentDialogue = newDest;
        this.canDisplay = false;
        this.parentCanvas.inDialogue = false;
        this.parentCanvas.someoneIsCalling = true;

        if (newDest.id == "sec" && allDials[0] == "sec") {
          Dialogue.currentBranchIndex = 2;
        } else {
          Dialogue.currentBranchIndex = index[1];
        }
      }
    } else {
      if (this.json["dialogue"][this.getIndexInJSON()]["id"] == "confirmed_button_spiel") {
        buttonCovered = false;
        bigRedButton.setState('uncovered');
      }
      
      Dialogue.currentBranchIndex = index;
      this.resetDial();
    }
  }

  resetDial() {
    this.dial = this.json["dialogue"][this.getIndexInJSON()]["text"];
    this.canBranch =
      this.json["dialogue"][this.getIndexInJSON()]["branching"];
    if (this.canBranch == undefined) {
      this.canBranch = false;
    }
    this.name = this.json["id"];
    this.curLine = 0;
    this.canClose = false;
    this.canDisplay = true;
    this.closingTimer = 0;
    dialStart = millis();
    this.paths = undefined;
    finishedLine = false;
    skippedLine = false;
  }

  setNewLinks(linkToList) {
    if ((!linkToList) instanceof Array) {
      throw new Error("Illegal Argument");
    }

    let actualLinkToList = [];

    for (let i = 0; i < linkToList.length; i++) {
      if (allDials.includes(linkToList[i].id) || linkToList[i].id == "sec") {
        actualLinkToList.push(linkToList[i]);
      }
    }

    this.linkToList = actualLinkToList;
    console.log(this.id + " links established");
  }

  setParentCanvas(newParent) {
    //console.log(newParent);
    if (newParent == null) {
      throw new Error("**Parent Canvas not stated as parameter!**");
    }
    this.parentCanvas = newParent;
    //sizes // constant
    this.cornerPoint = new p5.Vector(50, this.parentCanvas.height - 175);
    this.size = { width: this.parentCanvas.width - 100, height: 150 };
  }

  searchFor(givenName) {
    givenName = givenName.trim();
    if (this.linkToList == undefined) {
      throw new Error("no lists to iterate over");
    }

    return this.linkToList.find((elem) => elem.id == givenName);
  }

  runDefCon1() {
    //console.log(this.json["dialogue"].length - 1);
    Dialogue.weAreDead = true;

    //secretary specific dialogue
    if (this.json["id"] == "Secretary") {
    this.branchDialoguePaths(this.json["dialogue"].length - 2);
    } else {
          this.branchDialoguePaths(this.json["dialogue"].length - 1);
    }
  }
}
class DialogueChoice {
    static position = new p5.Vector(600, 230); //doesnt' matter. OutsideConsole.js reconfigures this position
    static positionInitialized = false;
    static origin;
    static num = 0;
    static hasBeenPicked = false;
    // static choiceWidth = 0;
    constructor(htmlButton, link, notDialogue = true) {
            if (DialogueChoice.hasBeenPicked) {
                DialogueChoice.hasBeenPicked = false;
                DialogueChoice.position.set(DialogueChoice.origin.x, DialogueChoice.origin.y);
                DialogueChoice.num = 0;
            }
            //start of vibe code => attaching css styling

    this.button = createButton(
      `<span class="flicker-text">${htmlButton}</span>`,
    );
    this.linkTo = link;

    this.button.addClass("dialogue-button");

    this.wrapper = createElement("div");
    this.wrapper.addClass("dialogue-button-parent");

    this.wrapper.elt.appendChild(this.button.elt);

    this.button.elt.addEventListener('animationend', () => {
                this.button.addClass('second-anim-class');
                this.wrapper.addClass('init-reveal');
            });
            
    let funSkew;
    switch (DialogueChoice.num) {
      case 1:
        funSkew = (4.75 + 0)/2 - (1 - ((4.75 + 0)/2 * (this.button.elt.getBoundingClientRect().width/216.4)));
        //console.log('transform:skew(' + str(-funSkew) + 'deg);');
        
        this.wrapper.style('transform:skew(' + str(-funSkew) + 'deg);');
        this.wrapper.position(DialogueChoice.position.x + 216.4/2 - this.button.elt.getBoundingClientRect().width/2, DialogueChoice.position.y + (83.45/2 - this.wrapper.elt.offsetHeight/2));
        DialogueChoice.position.add(227.6, 0);
        break;
      case 2:
        funSkew = (0 + -4.75)/2 - (1 - ((0 + -4.75)/2 * (this.button.elt.getBoundingClientRect().width/216.4)));
        console.log('transform:skew(' + str(-funSkew) + 'deg);');
        
        this.wrapper.style('transform:skew(' + str(-funSkew) + 'deg);');
        this.wrapper.position(DialogueChoice.position.x + 216.4/2 - this.button.elt.getBoundingClientRect().width/2, DialogueChoice.position.y + (83.45/2 - this.wrapper.elt.offsetHeight/2));
        DialogueChoice.position.add(221.8, 0);
        break;
      case 3:
        funSkew = (-5 + -9.5)/2 - (1 - ((-5 + -9.5)/2 * (this.button.elt.getBoundingClientRect().width/222.3)));
        console.log('transform:skew(' + str(-funSkew) + 'deg);');
        
        this.wrapper.style('transform:skew(' + str(-funSkew) + 'deg);');
        this.wrapper.position(DialogueChoice.position.x + 222.3/2 - this.button.elt.getBoundingClientRect().width/2, DialogueChoice.position.y + (83.45/2 - this.wrapper.elt.offsetHeight/2));
        DialogueChoice.position.add(227.7, 0);
        break;
      default:
        funSkew = (9.5 + 5)/2 - (1 - ((9.5 + 5)/2 * (this.button.elt.getBoundingClientRect().width/222.3)));
        //console.log('transform:skew(' + str(-funSkew) + 'deg);');
        
        this.wrapper.style('transform:skew(' + str(-funSkew) + 'deg);');
        this.wrapper.position(DialogueChoice.position.x + 222.3/2 - this.button.elt.getBoundingClientRect().width/2, DialogueChoice.position.y + (83.45/2 - this.wrapper.elt.offsetHeight/2));
        DialogueChoice.position.add(227.7, 0);
        break;
    }
    
    DialogueChoice.num++;
    // end of vibe code

    this.button.mousePressed(this.whenClicked);
  }
  //this solution was figured out by AI. I didn't know that arrow functions tie the this keyword to the instance.
  //I could have also used .bind(), but I decided not to
  whenClicked = () => {
    stopSound("talk");
    currentDialogue.branchDialoguePaths(this.linkTo);
    DialogueChoice.hasBeenPicked = true;
  };
}
