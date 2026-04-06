class Dialogue {
  constructor(fileName, parentCanvas) {
    this.fileName = fileName;
    this.parentCanvas = parentCanvas;
    if(this.parentCanvas == null) {
      throw new Error("**Parent Canvas not stated as parameter!**");
    }
    
    this.dial = json['dialogue'];
    
    this.curLine = 0;
  }
  
  display() {
    let e = this.parentCanvas;
    
    e.fill(0,200);
    e.stroke(0,255,0);
    
    e.rect(50, e.height - 175, e.width - 100, 150);
    e.noFill();
    
    setAlignment(false);
    writeStream(this.dial[this.curLine], 75, e.height - 140, 25, e);
    setAlignment(true);
  }
  
  nextLine() {
    if ((this.curLine + 1) < this.dial.length) {
      this.curLine++;
      dialStart = millis();
    }
  }
}
