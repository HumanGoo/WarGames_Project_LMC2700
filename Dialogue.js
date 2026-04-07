class Dialogue {
  constructor(fileName, parentCanvas) {
    this.fileName = fileName;
    this.parentCanvas = parentCanvas;
    if(this.parentCanvas == null) {
      throw new Error("**Parent Canvas not stated as parameter!**");
    }
    this.currentBranchIndex = 0
    this.dial = json['dialogue'][this.currentBranchIndex]['text'];
    this.canBranch = json['dialogue'][this.currentBranchIndex]['branching'];
    console.log(this.canBranch);
    if(this.canBranch == undefined){this.canBranch = false;}
    this.name = json['id'];
    this.curLine = 0;
    this.canClose = false
    this.canDisplay = true;
    this.closingTimer = 0;
    
    this.delay = false;
    //sizes // constant
    this.cornerPoint = new p5.Vector(50, parentCanvas.height - 175);
    this.size = {width:parentCanvas.width-100,height:150};
  }
  
  display() {
    let e = this.parentCanvas;
    let boxWidth = e.width - 100 - ((millis() - this.closingTimer) * 5);
    e.fill(0,200);
    e.stroke(0,255,0);
    
    if (!this.canClose) {
      e.rect(this.cornerPoint.x, this.cornerPoint.y, this.size.width,this.size.height);
      e.noFill();
      
      setAlignment(false);
      write(this.name, 75,e.height - 145,e);
      writeStream(this.dial[this.curLine], 85, e.height - 113, 25, e);
      setAlignment(true);
    } else if(!this.canBranch){
      //closes the window
        if (boxWidth > 0) {
          e.rect(e.width/2 - boxWidth/2, e.height - 175, boxWidth, 150);
        } else {
          this.canDisplay = false;
        }
    }
    if(this.paths == undefined && this.canBranch){
      this.paths = json['dialogue'][this.currentBranchIndex]['links'];
      dialogueChoices = this.paths;
      }
    
    this.delay = true;
  }
  
  nextLine() {
    if ((this.curLine + 1) < this.dial.length) {
      this.curLine++;
      dialStart = millis();
    } else if(!this.canBranch){
      this.canClose = true;
      this.closingTimer = millis();
    } 
    if ((this.curLine) < this.dial.length && this.canBranch){
      givenDialogueChoices = true;
    }
    this.delay = false;
  }

  isInsideBox(){
    let mouseVector = new p5.Vector(this.parentCanvas.mouseX,this.parentCanvas.mouseY);
    point = this.cornerPoint;
    return mouseVector.x > point.x && mouseVector.x < point.x + this.size.width
      && mouseVector.y > point.y && mouseVector.y < point.y + this.size.height;
  }
  branchDialoguePaths(index) {
    this.currentBranchIndex = index;
    this.dial = json['dialogue'][this.currentBranchIndex]['text'];
    this.canBranch = json['dialogue'][this.currentBranchIndex]['branching'];
    if(this.canBranch == undefined){this.canBranch = false;}
    this.name = json['id'];
    this.curLine = 0;
    this.canClose = false
    this.canDisplay = true;
    this.closingTimer = 0;
  }
}

class DialogueChoice {
  static position = new p5.Vector(600,230);
  static hasBeenPicked = false;
  constructor(htmlButton,link) {
    if(DialogueChoice.hasBeenPicked){
      DialogueChoice.hasBeenPicked = false;
      DialogueChoice.position.set(600,230);
    }
    this.button = createButton(htmlButton); 
    this.linkTo = link;
    console.log(this.linkTo);
    this.button.position(DialogueChoice.position.x,DialogueChoice.position.y);
    DialogueChoice.position.add(0,50);
    this.button.mousePressed(this.whenClicked);
  }
  //this solution was figured out by AI. I didn't know that arrow functions tie the this keyword to the instance.
  //I could have also used .bind(), but I decided not to
  whenClicked = () => {
    currentDialogue.branchDialoguePaths(this.linkTo);
    DialogueChoice.hasBeenPicked = true;
  }
}
