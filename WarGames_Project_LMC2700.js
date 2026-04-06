let computer = {};
function preload() {
  preLoadFont();
  computer.outline = loadImage('data/terminal.png');
  computer.board = loadImage('data/board.jpg');
}
let sceneNeedsChanging = false;
let currentScene;
let outsideConsoleScene;
let overlayScene;
computer.size = {width: 750, height: 450};



function setup() {
  computer.location = new p5.Vector((windowWidth - computer.size.width)/2,
  (windowHeight - computer.size.height)/2 - 60);
  stroke(0,255,0);
  loadWarGamesFont();
  outsideConsoleScene = new p5(outsideConsole);
  currentScene = new p5(mainMenu);
  loadOverlay();
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
function loadOverlay(){overlayScene = new p5(overlay);}
