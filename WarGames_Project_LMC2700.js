function preload() {
  preLoadFont();
}
let sceneNeedsChanging = false;
let currentScene;
function setup() {
  stroke(0,255,0);
  loadWarGamesFont();
  currentScene = new p5(mainMenu);
}

function draw() {
  //State Machine: needs to be called once
  console.log(sceneNeedsChanging);
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
