/*
  Game - This is where the game starts
*/

import Player from "./Player"
import Shop from "./gui/Shop"
import TradeItem from "./gui/TradeItem"
import BorderedButton from "./gui/buttons/BorderedButton"


export default class Game {
  constructor() {
    this.player = new Player(); // contains inventory

    //this.world = new World(this.player);
    this.shop = new Shop();


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
