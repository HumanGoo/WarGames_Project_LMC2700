let computer = {};
let json;
function preload() {
  preLoadFont();
  computer.outline = loadImage('data/terminal.png');
  computer.board = loadImage('data/board.jpg');
  json = loadJSON("data/dialogue/test.json");
}
let sceneNeedsChanging = false;
let currentScene;
let dialStart;
computer.size = {width: 750, height: 450};

function setup() {
  computer.location = new p5.Vector((windowWidth - computer.size.width)/2,
  (windowHeight - computer.size.height)/2 - 60);
  stroke(0,255,0);
  loadWarGamesFont();
  new p5(outsideConsole);
  currentScene = new p5(mainMenu);
  new p5(overlay);
}

function draw() {
  //State Machine: needs to be called once
  //console.log(sceneNeedsChanging);
  if(sceneNeedsChanging) {
    switch(currentScene) {
      /*
      case "Main Menu":
        new p5(mainMenu);
        console.log("scene update");
        break;
        */
    }
    sceneNeedsChanging = false;
  }
}

function switchScene(newScene) {
  //remove the current Scene
  currentScene.remove();
  //set current scene to the new one
  currentScene = new p5(newScene);
}
