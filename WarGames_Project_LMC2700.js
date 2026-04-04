function preload() {
  preLoadFont();
}
let sceneNeedsChanging = false;
let currentScene;
let computerScreenLocation = new p5.Vector(0,0);
function setup() {
  stroke(0,255,0);
  loadWarGamesFont();
  currentScene = new p5(mainMenu);
  console.log(Object.getPrototypeOf(currentScene).toString());
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
