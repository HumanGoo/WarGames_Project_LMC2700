function preload() {
  preLoadFont();
}
let sceneNeedsChanging = false;
let currentScene = "Main Menu";
function setup() {
  stroke(0,255,0);
  loadWarGamesFont();
  menu = new p5(mainMenu);
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
