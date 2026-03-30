function write(str, x, y, e) {
  hpLineFont.drawString(str, x, y,e);
}


//rate is in seconds... i e the amount of letters that are written per second.
// This means that it should work regardless of the frame rate.
function writeStream(str, x, y, rate) {
  let len = str.length;
  let time = millis()/1000;
  let charPerSec = time * rate;
  let frame = Math.round(time%1); //the exact moment the next character is added
  let addend;
  if (frame==1 ||(charPerSec < len && charPerSec > 0)) {
    addend = "_";
  } else {
    addend = "";
  }
  let subString = str.substring(0, charPerSec) + addend;
  write(subString, x, y);
}
