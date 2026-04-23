let computer = {};
let json;
let WINDOWHEIGHT = 789;
let WINDOWWIDTH = 1600;
let audioFileStrs = ["phoneHangUp", "phonePickUp", "phoneRing", "talk"];
let audioFiles = [];

let jsonList = [];
function preload() {
  // soundFormats('wav');
  for (let i = 0; i < audioFileStrs.length; i++) {
    let af = loadSound("data/sfx/" + audioFileStrs[i] + ".wav");

    audioFiles.push(af);
  }

  preLoadFont();
  computer.outline = loadImage("data/terminal.png");
  computer.board = loadImage("data/board.jpg");
  let stringsList = ["secretary", "congress", "press", "businessman", "leader"];
  stringsList.forEach((elem) => {
    let temp = loadJSON("data/dialogue/" + elem + ".json");
    jsonList.push(temp);
  });
}

let sceneNeedsChanging = false;
let currentScene; //the current scene on screen
let dialStart;
let outsideConsoleScene;
let overlayScene;
/** the current dialogue being shown on CurrentScreen*/
let currentDialogue;

computer.size = { width: 750, height: 450 };

let secretaryDial;
let pressDial;
let congressDial;
let ceoDial;
let leaderDial;

let pushedButton;

let finishedLine = false;

function setup() {
  getAudioContext().suspend();

  computer.location = new p5.Vector(
    (WINDOWWIDTH - computer.size.width) / 2,
    (WINDOWHEIGHT - computer.size.height) / 2 - 70,
  );
  stroke(0, 255, 0);
  loadWarGamesFont();
  outsideConsoleScene = new p5(outsideConsole);
  currentScene = new p5(mainMenu);
  loadOverlay();

  initializeDialogues();
}

async function loadSounds() {
  audioFiles = [];

  for (let i = 0; i < audioFileStrs.length; i++) {
    let af = await loadSound("data/sfx/" + audioFileStrs[i] + ".wav");
    audioFiles.push(af);
  }
}

function playSound(sound, loop = false, variance = false) {
  if (!audioFileStrs.includes(sound)) {
    throw new ReferenceError("Sound not found");
  }

  let index = audioFileStrs.indexOf(sound);
  //sound.setVolume(.8);

  if (loop) {
    audioFiles[index].loop();
  } else {
    audioFiles[index].play();
  }
}
function setSoundPitch(sound, random = false, pitch = null) {
  let index = audioFileStrs.indexOf(sound);
  let currentPitch = pitch;
  const talkRates = [-0.2, 0, 0, 0.1, 0.25, 0.3];
  if (random) {
    currentPitch += talkRates[Math.floor(Math.random() * talkRates.length)];
  }
  if (
    audioFiles[index].isPlaying() &&
    audioFiles[index].currentTime() >= audioFiles[index].duration() - 0.05
  ) {
    audioFiles[index].rate(currentPitch);
  }
}
// Source - https://stackoverflow.com/a/36481059
// Posted by Maxwell Collard, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-22, License - CC BY-SA 4.0

// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

function stopSound(sound) {
  if (!audioFileStrs.includes(sound)) {
    throw new ReferenceError("Sound not found");
  }

  let index = audioFileStrs.indexOf(sound);

  audioFiles[index].stop();
}

function switchScene(newScene) {
  //remove the current Scene
  currentScene.remove();
  //outsideConsoleScene.remove();
  overlayScene.remove();
  //set current scene to the new one
  currentScene = new p5(newScene);
  loadSounds();
  //new p5(overlay);
  //loadOverlay();
}
function loadOverlay() {
  overlayScene = new p5(overlay);
}
/*
const redScreen = {
 blare() {
 
 }
 }
 p5.prototype.redScreenBlaringA = redScreen.blare;
 */

function initializeDialogues() {
  secretaryDial = new Dialogue(jsonList[0], "sec");
  congressDial = new Dialogue(jsonList[1], "cong");
  pressDial = new Dialogue(jsonList[2], "press");
  ceoDial = new Dialogue(jsonList[3], "ceo");
  leaderDial = new Dialogue(jsonList[4], "lead");

  secretaryDial.setNewLinks([pressDial, congressDial, ceoDial, leaderDial]);
  pressDial.setNewLinks([secretaryDial, congressDial, ceoDial, leaderDial]);
  // congressDial.setNewLinks([pressDial, congressDial, ceoDial, leaderDial]);
  // ceoDial.setNewLinks([pressDial, congressDial, ceoDial, leaderDial]);
  // leaderDial.setNewLinks([secretaryDial, pressDial, congressDial, ceoDial, leaderDial]);
  // congressDial.setNewLinks([pressDial,congressDial,ceoDial,leaderDial]);

  // console.log(secretaryDial.linkToList);
}

function mousePressed() {
  getAudioContext().resume();
}
