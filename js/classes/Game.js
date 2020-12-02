/*
  This is where the game starts
*/

class Game {
  /*
    Game Modes:
      0 => normal
      1 => creative
  */
  constructor(gameMode = 0) {

    // create the svg
    let welcomeScreen = d3.select("#welcomeScreen")
    welcomeScreen.remove()

    let svg = d3.select("body")
      .append("svg")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)

    this.player = new Player();
    this.world = new World(this.player);



    if(gameMode === 0) {
      console.log("Normal Mode");
      // add normal inventory to player

    } else if(gameMode === 1) {
      console.log("Creative Mode");
      // add creative inventory to player
    }

    this.player.createSVG();
    this.player.update();

    /*var testTradeItem = new TradeItem(
      {x: 30, y: 30},
      50, 50, "Player", 100, 50);

    var testBtn = new BorderedButton(
      {x: 100, y: 100},
      50, 50, 2
    )*/



  }
}
