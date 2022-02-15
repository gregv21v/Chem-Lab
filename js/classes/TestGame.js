/*
  This is where the game starts
*/

class TestGame {
  constructor() {
    this.player = new TestPlayer(); // contains inventory

    //this.world = new World(this.player);
    this.store = new Store();


    var testTradeItem = new TradeItem(
      {x: 30, y: 30},
      50, 50, "Player", 100, 50);

    var testBtn = new BorderedButton(
      {x: 100, y: 100},
      50, 50, 2
    )

    //testBtn.createSVG();

    this.player.createSVG();
    this.player.update();

    //testTradeItem.createSVG();
    //this.gui = new GUI();


    // setup the player


    // setup the world


    // setup the store



    // setup the gui
  }
}
