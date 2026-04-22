
class Dialogue {
    static currentBranchIndex = 0;

    constructor(file, name = null) {
        this.id = name;
        this.json = file;
        this.parentCanvas = null;

        this.dial = this.json['dialogue'][Dialogue.currentBranchIndex]['text'];
        this.canBranch = this.json['dialogue'][Dialogue.currentBranchIndex]['branching'];
        if (this.canBranch == undefined) {
            this.canBranch = false;
        }
        this.name = this.json['id'];
        this.curLine = 0;
        this.canClose = false
        this.canDisplay = true;
        this.closingTimer = 0;
        this.picPath = "data/" + this.json['pic'];
        this.pic = loadImage(this.picPath);

        this.delay = false;

        this.linkToNext = {};
    }

    display() {
        let e = this.parentCanvas;
        let boxWidth = e.width - 100 - ((millis() - this.closingTimer) * 5);
        e.fill(0, 200);
        e.stroke(0, 255, 0);

        if (!this.canClose) {
            e.rect(this.cornerPoint.x, this.cornerPoint.y, this.size.width, this.size.height);
            e.noFill();

            setAlignment(false);
            write(this.name, 75, e.height - 145, e);
            writeStream(this.dial[this.curLine], 85, e.height - 113, 25, e);
            if (!audioFiles[3].isPlaying() && !finishedLine) {
              playSound('talk', true);
            }
            setAlignment(true);
        } else if (!this.canBranch) {
            //closes the window
            playSound("phoneHangUp", false);
            if (boxWidth > 0) {
                e.rect(e.width / 2 - boxWidth / 2, e.height - 175, boxWidth, 150);
            } else {
                this.canDisplay = false;
            }
        }
        if (this.paths == undefined && this.canBranch) {
            this.paths = this.json['dialogue'][Dialogue.currentBranchIndex]['links'];
            //console.log(this.paths);
            dialogueChoices = this.paths;
        }

        this.delay = true;
    }

    nextLine() {
        // console.log("to next line");
        if ((this.curLine + 1) < this.dial.length) {
            this.curLine++;
            dialStart = millis();
        } else if (!this.canBranch) {
            this.canClose = true;
            this.closingTimer = millis();
        }
        if ((this.curLine + 1) == this.dial.length && this.canBranch) {
            givenDialogueChoices = true;
        }
        this.delay = false;
        finishedLine = false;
    }

    isInsideBox() {
      let mouseVector = new p5.Vector(this.parentCanvas.mouseX, this.parentCanvas.mouseY);
      point = this.cornerPoint;
      return mouseVector.x < this.parentCanvas.width && mouseVector.x > 0
        && mouseVector.y > 0 && mouseVector.y < this.parentCanvas.height;
    }
    
    branchDialoguePaths(index) {
      //check if array
      //if so, index 0 is the file name we path to
      //index 1 is the index we set it to be.
      if (index == "checkLinks") {
        console.log("here");
        if (allDials[0] == "sec") {
          Dialogue.currentBranchIndex = 2;
        } else {
          Dialogue.currentBranchIndex = 5;
        }
        this.resetDial();
        return;
      }
      if(typeof index === 'object') {
        if (index[0] == "endState") {
          pushedButton = boolean(index[1]);
          sceneNeedsChanging = true;
        } else {
          console.log("sending you to: " + index);
          let newDest = this.searchFor(index[0]);
          console.log(newDest);
          if (allDials.includes(index[0])) {
            allDials.splice(allDials.indexOf(index[0]), 1);
          }
          if (allDials.length == 0) {
            allDials.push("sec");
            newDest.setNewLinks([secretaryDial]);
          } else {
            newDest.setNewLinks([secretaryDial, pressDial, congressDial, ceoDial, leaderDial]);
          }
          currentDialogue = newDest;
          this.canDisplay = false;
          this.parentCanvas.inDialogue = false;
          this.parentCanvas.someoneIsCalling = true;
          
          if (newDest.id == "sec" && allDials[0] == "sec") {
            Dialogue.currentBranchIndex = 2;
          }
          else {
            Dialogue.currentBranchIndex = index[1];
          }
        }
      } else {
        Dialogue.currentBranchIndex = index;
        this.resetDial();
      }
    }
    
    resetDial() {
        this.dial = this.json['dialogue'][Dialogue.currentBranchIndex]['text'];
        this.canBranch = this.json['dialogue'][Dialogue.currentBranchIndex]['branching'];
        if (this.canBranch == undefined) {
            this.canBranch = false;
        }
        this.name = this.json['id'];
        this.curLine = 0;
        this.canClose = false
        this.canDisplay = true;
        this.closingTimer = 0;
        dialStart = millis();
        this.paths = undefined;
        finishedLine = false;
    }
    
    setNewLinks(linkToList) {
        if (!linkToList instanceof(Array)) {
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
        if (this.linkToList == undefined) {
            throw new Error("no lists to iterate over")
        }
    
        return this.linkToList.find((elem) => elem.id == givenName);
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
                DialogueChoice.choiceWidth = 0;
            }
            //start of vibe code

            this.button = createButton(`<span class="flicker-text">${htmlButton}</span>`);
            this.linkTo = link;

            this.button.addClass('dialogue-button');

            this.wrapper = createElement('div');
            this.wrapper.addClass('dialogue-button-parent');

            this.wrapper.elt.appendChild(this.button.elt);

            this.button.elt.addEventListener('animationend', () => {
                this.button.addClass('second-anim-class');
                this.wrapper.addClass('init-reveal');
            });

            this.wrapper.position(DialogueChoice.position.x, DialogueChoice.position.y);

            DialogueChoice.position.add(this.button.elt.offsetWidth + 25, 0);
            DialogueChoice.num++;
            // DialogueChoice.choiceWidth += this.button.elt.offsetWidth + 25;

            this.button.mousePressed(this.whenClicked);
        }
        //this solution was figured out by AI. I didn't know that arrow functions tie the this keyword to the instance.
        //I could have also used .bind(), but I decided not to
    whenClicked = () => {
        currentDialogue.branchDialoguePaths(this.linkTo);
        DialogueChoice.hasBeenPicked = true;
    }
}
