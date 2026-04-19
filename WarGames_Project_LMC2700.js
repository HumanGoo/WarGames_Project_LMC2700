let computer = {};
let json;
let WINDOWHEIGHT = 789;
let WINDOWWIDTH = 1600;


let jsonList = [];
function preload() {
  preLoadFont();
  computer.outline = loadImage('data/terminal.png');
  computer.board = loadImage('data/board.jpg');
  let stringsList = ["secretary","congress","press","businessman","leader"];
  stringsList.forEach(elem => {
    let temp = loadJSON("data/dialogue/"+elem+".json");
    jsonList.push(temp)
  
  });
}

let sceneNeedsChanging = false;
let currentScene; //the current scene on screen
let dialStart;
let outsideConsoleScene;
let overlayScene;
/** the current dialogue being shown on CurrentScreen*/
let currentDialogue;

computer.size = {width:
750, height:
450};

let secretaryDial;
let pressDial;
let congressDial;
let ceoDial;
let leaderDial;

let allDials = ["cong", "press", "ceo", "lead"];
let pushedButton;

function setup() {
  computer.location = new p5.Vector((WINDOWWIDTH - computer.size.width)/2,
    (WINDOWHEIGHT - computer.size.height)/2 - 60);
  stroke(0, 255, 0);
  loadWarGamesFont();
  outsideConsoleScene = new p5(outsideConsole);
  currentScene = new p5(mainMenu);
  loadOverlay();

  initializeDialogues();

}

function switchScene(newScene) {
  //remove the current Scene
  currentScene.remove();
  //outsideConsoleScene.remove();
  overlayScene.remove();
  //set current scene to the new one
  currentScene = new p5(newScene);
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
  // pressDial.setNewLinks([pressDial, congressDial, ceoDial, leaderDial]);
  // congressDial.setNewLinks([pressDial, congressDial, ceoDial, leaderDial]);
  // ceoDial.setNewLinks([pressDial, congressDial, ceoDial, leaderDial]);
  // leaderDial.setNewLinks([secretaryDial, pressDial, congressDial, ceoDial, leaderDial]);
  // congressDial.setNewLinks([pressDial,congressDial,ceoDial,leaderDial]);

  // console.log(secretaryDial.linkToList);
 }
