/*
  Game - This is where the game starts
*/

import Player from "./Player"
import Shop from "./gui/Shop"
import TradeItem from "./gui/TradeItem"
import BorderedButton from "./gui/buttons/BorderedButton"


export default class Game {

  /**
   * constructor()
   * @description constructs the game 
   * @param {Integer} mode the mode of the game
   *  modes 
   *    0 => Test
   *    1 => Creative
   *    2 => Normal   
   */
  constructor(mode=0) {
    this._mode = mode;

    this._player = new Player(); // contains inventory

    //this.world = new World(this._player);
    this._shop = new Shop();


    this._testTradeItem = new TradeItem(
      {x: 30, y: 30},
      50, 50, "Player", 100, 50);

    this._testBtn = new BorderedButton(
      {x: 100, y: 100},
      50, 50, 2
    )

 
    //this.gui = new GUI();


    // setup the player


    // setup the world


    // setup the shop



    // setup the gui
  }


  /**
   * render() 
   * @description renders the game 
   */
  render() {
    this._player.createSVG();
    this._player.update()

    this._testBtn.createSVG();
    this._testTradeItem.createSVG();
  }
}
