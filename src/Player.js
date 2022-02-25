/*
  Player - The Player object stores all the relavent information about the player
  including items that he has in the shop, and in the world.
*/

import World from "./World"
import Inventory from "./gui/Inventory"
import ValueBox from "./gui/ValueBox"
import Valve from "./world_objects/Valve"
import Pipe from "./world_objects/Pipe"
import Tank from "./world_objects/tanks/Tank"
import Pump from "./world_objects/Pump"
import * as d3 from "d3"

export default class Player {

  /**
   * constructor()
   * @description constructs the Player
   */
  constructor() {
    let svg = d3.select("svg");
    let height = svg.attr("height") - 30;

    this._hand = null;

    

    this.world = new World(this, {x: 270, y: 20}, svg.attr("width") - (270 + 400), height);

    this.inventory = new Inventory(this, {x: 20, y: 45}, 250, height - 25);
    this.inventory.create(svg);

    this.credits = new ValueBox({x: 20, y: 20}, 250, 25);
    this.credits.create(svg)

    this.credits.styling = {
      color: "red",
      textColor: "black",
      strokeColor: "black",
      strokeWidth: 10
    }

    this.credits.label = "Coins";
    this.credits.value = 0;

    // add example items to the players inventory

    this.inventory.add(new Valve(
      {
        x: this.inventory.width + this.world.getWidth()/2,
        y: this.world.getHeight()/2
      },
      20, 10, 5
    ));
    this.inventory.add(new Tank({x: 475, y: 540}, {width: 40, height: 100}, 5));
    this.inventory.add(new Tank({x: 475, y: 540}, {width: 50, height: 50}, 5));
    this.inventory.add(new Tank({x: 0, y: 0}, {width: 50, height: 50}, 5, false, false, false, false))
    this.inventory.add(new Pipe({x: 500, y: 500}, 50, 10, 5));

    //this.inventory.createSlots();

    /**
     * Test Tanks
     */
    let startX = 300;
    let startY = 100;
    
    let testTanks = [
      new Tank(
        {x: startX + 100, y: startY}, {width: 40, height: 40}, 5, 
        true, true, true, true 
      ),
      new Tank(
        {x: startX + 200, y: startY}, {width: 40, height: 40}, 5, 
        true, false, true, true 
      ),
      new Tank(
        {x: startX + 300, y: startY}, {width: 40, height: 40}, 5, 
        true, true, false, true 
      ),
      new Tank(
        {x: startX + 400, y: startY}, {width: 40, height: 40}, 5, 
        true, true, true, false 
      ),
      new Tank(
        {x: startX + 500, y: startY}, {width: 40, height: 40}, 5, 
        true, false, false, true 
      ),
      new Tank(
        {x: startX + 600, y: startY}, {width: 40, height: 40}, 5, 
        false, false, false, false 
      )
    ]


    // positioned sell tank at center of world.
    var sellTank = new Tank(
      {
        x: this.inventory.width + this.world.getWidth()/2 - 100, /* border width of sell button */
        y: this.inventory.height - 50 - 6 // Space for the button
      },
      {
        width: 200,
        height: 40
      },
      5
    );
    sellTank.wallColor = "red";


    /*this.sellBtn.setOnClick(function() {
      console.log("Sold");

      // get the liquid from the tank
      var liquid = sellTank.getLiquid();
      console.log(liquid);

      // empty the tank
      sellTank.empty();

      self.credits.value += liquid.amount * liquid.type.value;
      self.credits.updateText();
      self.credits.createSVG();

    })*/

    var startPump = new Pump(this.world, {x: 0, y: 0}, 10);
    startPump.position.x = this.inventory.width + this.world.getWidth()/2 - startPump.getWidth()/2;
    startPump.position.y = startPump.getWidth() + startPump.production;

    var testValve = new Valve(
      {x: this.world.getWidth() / 2, y: this.world.getHeight() / 2},
      100, // width
      10, // interiorHeight
      5  // wallWidth
    )
    //testValve.showSnapAreas();

    /*var testFaucet = new Faucet({
      x: this.inventory.getWidth() + this.world.getWidth()/2 - 100,
      y: 50
    }, 50, 40, 10)*/



    this.world.add(sellTank);
    this.world.add(startPump);
    //this.world.add(testValve)
    //this.world.add(testFaucet);
  }

  /**
   * create()
   * @description creates the player
   */
  create() {
    this.world.createSVG()
  }

  update() {
    var self = this;
    setInterval(function() {
      self.world.update();
    }, 20);
  };

  /**
   * onKeyPress()
   * @description called when a key is pressed
   */
  onKeyPress(event) {
    this.inventory.onKeyPress(event);

    console.log(event.key)
    if(event.key === 'r' && this._hand instanceof Pipe) {
      this._hand.rotate();
      this._hand.updateSVG();
    }
  }

  /**
   * get hand()
   * @returns the object in the players hand
   */
  get hand() {
    return this._hand;
  }

}
