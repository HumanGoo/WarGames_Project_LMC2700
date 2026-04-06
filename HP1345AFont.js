// Poul-Henning Kamp reverse-engineered the character
// generator on the HP1345A digital vector display, c.1985
// Ported from https://phk.freebsd.dk/hacks/Wargames/index.html
// Uses or adapts the following resources:
// https://phk.freebsd.dk/_downloads/e52aa694fd64ff9d2a1a7291b7697f3e/hp1345_font.py
// https://phk.freebsd.dk/_downloads/a89c073235ca9c2b13d657173d32bf78/01347-80012.bin
// https://phk.freebsd.dk/_downloads/2355976608a6359335e30a88e181f1fc/1816-1500.bin

//HP1345AFont.js has been modified for the purposes of our project, but its original owner is
//https://github.com/golanlevin/p5-single-line-font-resources/tree/main

/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <phk@FreeBSD.org> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.   Poul-Henning Kamp
 * ----------------------------------------------------------------------------
 * This file reads the ROMs and produces a list of delta-vectors.
 */
let hpLineFont;
let strokeBytes;
let indexBytes;
let romFilesLoaded = false;
let alignment = false;

class HP1345AFont {
  constructor() {
    this.v = Array(256).fill([]);
    this.pts = null;
    this.idx = null;
    this.used = null;
    this.loadROMs();
  }

  loadROMs() {
    this.pts = strokeBytes.bytes;
    this.idx = indexBytes.bytes;
    this.used = Array(this.pts.length).fill(false);
    this.buildAllCharacters();
  }

  buildCharacter(ch) {
    const ia = (ch & 0x1f) | ((ch & 0xe0) << 1);
    let sa = this.idx[ia] << 2;
    sa |= ((1 ^ (ch >> 5) ^ (ch >> 6)) & 1) << 10;
    sa |= ((ch >> 7) & 1) << 11;
    if (!this.pts[sa] && !this.pts[sa + 1]) return;

    const l = [];
    while (true) {
      if (this.used[sa]) return;
      this.used[sa] = true;

      let dx = this.pts[sa] & 0x3f;
      if (this.pts[sa] & 0x40) dx = -dx;

      let dy = this.pts[sa + 1] & 0x3f;
      if (this.pts[sa + 1] & 0x40) dy = -dy;

      if (!(this.pts[sa] & 0x80)) l.push([]);
      if (l.length === 0) l.push([[0, 0]]);
      l[l.length - 1].push([dx, dy]);
      if (this.pts[sa + 1] & 0x80) break;
      sa += 2;
    }
    this.v[ch] = l;
  }

  buildAllCharacters() {
    for (let i = 0; i < 128; i++) {
      this.buildCharacter(i);
    }
    [0x9b, 0x9e, 0x91, 0x82].forEach((i) => this.buildCharacter(i));
    for (let i = 128; i < 256; i++) {
      this.buildCharacter(i);
    }
  }

  vectors(ch) {
    return this.v[ch];
  }

  bbox(ch, bbox = null, x = 0, y = 0) {
    if (!bbox) bbox = [0, 0, -999, -999];
    this.v[ch].forEach((i) =>
      i.forEach(([dx, dy]) => {
      x += dx;
      y += dy;
      bbox[0] = Math.min(bbox[0], x);
      bbox[1] = Math.min(bbox[1], y);
      bbox[2] = Math.max(bbox[2], x);
      bbox[3] = Math.max(bbox[3], y);
    }
    )
    );
    return [bbox, x, y];
  }

  drawCharacter(ch, px, py, e) {
    let count = 0;
    let unmodifiedCode = ch.charCodeAt(0);
    let asciiCode = unmodifiedCode & 0xff; //fits the given code within the range of our characters' ascii codes
    //console.log(asciiCode);
    let x = px;
    let y = py;
    e.beginShape();
    if (unmodifiedCode == 8254) {
      asciiCode = 95;
    }
    this.vectors(asciiCode).forEach((j) => {
      j.forEach(([dx, dy]) => {
        switch(unmodifiedCode) {
        case 95:
          x -= dx;
          y -= dy;
          break;
        case 8254:
          x -= dx;
          let newY = y - 18;
          vertex(x, newY);
          return;
          break;
        case 126:
          switch(count) {
          case 0:
            x-=0;
            y-=8;
            break;
          case 1:
            x+=4
            y+=49;
            break;
          case 2:
            x-=46;
            y+=4;
            break;
          case 3:
            x+=4;
            y-=57;
            break;
          case 4:
            x+=53;
            y+=0;
            break;
          }

          x += dx;
          y -= dy;
          break;

        default:
          x += dx;
          y -= dy;
          break;
        }
        //each character is about 18 pixels wide
        e.vertex(x, y);
        /* for debugging the text.
        e.textSize(5);
        e.circle(x,y,2);
        e.line(x,y, x + 10, y-10);
        e.text(`(${x},${y})`,x +10,y -10);
        */
        ;
        count++;
      }
      );

      e.endShape();
      e.beginShape();
    }
    );
    e.endShape();
  }

  drawString(w, px, py, e) {
    let lineCharCount = 0;
    
    e.noFill();
    e.strokeWeight(1);
    const spacing = 16;
    px = charAlign(w,px);
    for (let i = 0; i < w.length; i++) {
      lineCharCount++
      
      const ch = w[i];
      let newPx = px + i * spacing;

      if (ch == "\n") {
        px -= (lineCharCount) * spacing;
        py += 32;
        lineCharCount = 0;
      }


      this.drawCharacter(ch, newPx, py,e);
    }
  }
}

function loadWarGamesFont() {
  if (romFilesLoaded) {
    hpLineFont = new HP1345AFont();
  }
}

function checkIfBothFilesAreLoaded() {
  if (strokeBytes && indexBytes) {
    romFilesLoaded = true;
  }
}

function preLoadFont() {
  // Load files with loadBytes
  loadBytes("data/01347-80012.bin", (data) => {
    strokeBytes = data;
    checkIfBothFilesAreLoaded();
  }
  );

  loadBytes("data/1816-1500.bin", (data) => {
    indexBytes = data;
    checkIfBothFilesAreLoaded();
  }
  );
}

//WRITING FUNCTIONS ____ ORIGINAL
function write(str, x, y, e) {
  hpLineFont.drawString(str, x, y,e);
}
//rate is in seconds... i e the amount of letters that are written per second.
// This means that it should work regardless of the frame rate.
function writeStream(str, x, y, rate, e) {
  let len = str.length;
  let time = (millis() - dialStart)/1000;
  let charPerSec = time * rate;
  let frame = Math.round(time%1); //the exact moment the next character is added
  let addend;
  if (frame==1 ||(charPerSec < len && charPerSec > 0)) {
    addend = "_";
  } else {
    addend = "";
  }
  let subString = str.substring(0, charPerSec) + addend;
  write(subString, x, y, e);
}

function charAlign(string,x) {
  if(!alignment) {
    return x;
  }
  let displacement = (measureText(string,20) / 2);
  return x - displacement;
}

function setAlignment(bool) {
  alignment = bool;
}

/*I did not code this. Thankfully someone else on the internet measured all the lengths of the individual
  ASCII characters. linked here: https://blocks.roadtolarissa.com/tophtucker/62f93a4658387bb61e4510c37e2e97cf
*/
function measureText(string, fontSize = 10) {
  const widths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.1433349609375
    ,0.4133331298828125,0.4883331298828125,0.6916671752929687,0.6916671752929687,1.02166748046875
    ,0.8,0.325,0.46666717529296875,0.46666717529296875,0.523333740234375,0.720001220703125
    ,0.4133331298828125,0.46666717529296875,0.4133331298828125,0.4133331298828125,0.6916671752929687
    ,0.6916671752929687,0.6916671752929687,0.6916671752929687,0.6916671752929687,0.6916671752929687
    ,0.6916671752929687,0.6916671752929687,0.6916671752929687,0.6916671752929687,0.4133331298828125
    ,0.4133331298828125,0.720001220703125,0.720001220703125,0.720001220703125,0.6916671752929687
    ,1.15,0.8,0.8,0.8583343505859375,0.8583343505859375,0.8,0.748333740234375,0.9116668701171875
    ,0.8583343505859375,0.4133331298828125,0.6333343505859375,0.8,0.6916671752929687,0.9666671752929688
    ,0.8583343505859375,0.9116668701171875,0.8,0.9116668701171875,0.8583343505859375,0.8
    ,0.748333740234375,0.8583343505859375,0.8,1.0783340454101562,0.8,0.8,0.748333740234375
    ,0.4133331298828125,0.4133331298828125,0.4133331298828125,0.6050003051757813,0.6916671752929687
    ,0.46666717529296875,0.6916671752929687,0.6916671752929687,0.6333343505859375,0.6916671752929687
    ,0.6916671752929687,0.4133331298828125,0.6916671752929687,0.6916671752929687,0.35666656494140625
    ,0.35666656494140625,0.6333343505859375,0.35666656494140625,0.9666671752929688,0.6916671752929687
    ,0.6916671752929687,0.6916671752929687,0.6916671752929687,0.46666717529296875,0.6333343505859375
    ,0.4133331298828125,0.6916671752929687,0.6333343505859375,0.8583343505859375,0.6333343505859375
    ,0.6333343505859375,0.6333343505859375,0.46666717529296875,0.395001220703125,0.46666717529296875
    ,0.720001220703125]
  const avg = 0.6589302785773028
  return string
    .split('')
    .map(c => c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg)
    .reduce((cur, acc) => acc + cur) * fontSize
}
