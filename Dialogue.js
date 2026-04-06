class Dialogue {
  constructor(fileName, parentCanvas) {
    this.fileName = fileName;
    this.parentCanvas = parentCanvas;
    if(this.parentCanvas == null) {
      throw new Error("**Parent Canvas not stated as parameter!**");
    }
    
    this.dial = json['dialogue'];
    
    this.curLine = 0;
    this.canClose = false;
    this.canDisplay = true;
    this.closingTimer = 0;
  }
  
  display() {
    let e = this.parentCanvas;
    let boxWidth = e.width - 100 - ((millis() - this.closingTimer) * 5);
    
    e.fill(0,200);
    e.stroke(0,255,0);
    
    if (!this.canClose) {
      e.rect(50, e.height - 175, e.width - 100, 150);
      e.noFill();
      
      setAlignment(false);
      writeStream(this.dial[this.curLine], 75, e.height - 140, 25, e);
      setAlignment(true);
    } else {
        if (boxWidth > 0) {
          e.rect(e.width/2 - boxWidth/2, e.height - 175, boxWidth, 150);
        } else {
          this.canDisplay = false;
        }
    }
    
    /*e.rect(50, e.height - 175, e.width - 100, 150);
      e.noFill();
      
      setAlignment(false);
      writeStream(this.dial[this.curLine], 75, e.height - 140, 25, e);
      setAlignment(true);*/
  }
  
  nextLine() {
    if ((this.curLine + 1) < this.dial.length) {
      this.curLine++;
      dialStart = millis();
    } else {
      this.canClose = true;
      this.closingTimer = millis();
    }
  }
}
