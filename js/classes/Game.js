/*
  This is where the game starts
*/

function Game() {
  var width = 1770;
  var height = 650;
  var svg = d3.select("body")
              .select("#game")
              .attr("width", 1770)
              .attr("height", 650)
  this.player = new Player(); // contains inventory

  this.world = new World(this.player);
  this.store = new Store();


  var testTradeItem = new TradeItem(
    {x: 10, y: 10},
    width - 400, 50, "Player", 100, 50);

  var testBtn = new BorderedButton(
    {x: 100, y: 100},
    50, 50, 2
  )

  testBtn.createSVG();
  testTradeItem.createSVG();

  //this.player.createSVG();
  //this.player.update();


  //this.gui = new GUI();


  // setup the player


  // setup the world


  // setup the store



  // setup the gui

}
