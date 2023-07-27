/*
  Game - This is where the game starts
*/

import Player from "./Player"
import Shop from "./gui/Shop"
import TradeItem from "./gui/TradeItem"
import BorderedButton from "./gui/buttons/BorderedButton"
import * as d3 from "d3"
import FluidRegistry from "./world_objects/fluids/FluidRegistry"
import Fluid from "./world_objects/fluids/Fluid"
import EmptyFluid from "./world_objects/fluids/EmptyFluid"
import ScrollableContainer from "./gui/ScrollableContainer"
import World from "./World"
import { HUD } from "./HUD"
import Valve from "./world_objects/pipes/Valve"
import Tank from "./world_objects/tanks/Tank"
import Pipe from "./world_objects/pipes/Pipe"
import CrossPipe from "./world_objects/pipes/CrossPipe"
import Pump from "./world_objects/Pump"
import ElbowPipe from "./world_objects/pipes/ElbowPipe"
import Rect from "./shapes/Rect"
import { rotatePoints } from "./shapes/Point"
import Group from "./shapes/Group"
import Heater from "./world_objects/Heater"


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
    let svg = d3.select("svg")

    this._width = svg.attr("width")
    this._height = svg.attr("height")

    this._layers = []

    this._layers.push(svg.append("g")) // gui
    this._layers.push(svg.append("g")) // containers
    this._layers.push(svg.append("g")) // fluids
    this._layers.push(svg.append("g")) // debug

    this._layers[0].attr("name", "gui")
    this._layers[1].attr("name", "containers")
    this._layers[2].attr("name", "fluids")
    this._layers[3].attr("name", "debug")


    let snapWidth = 75
    let pipeLength = 100;
    let pipeWidth = 50;
    let position = {x: 400, y: 100}
    let angle = 180

    this._group = new Group();

    /*let mockPipe = new Rect(this._layers[3], position, pipeWidth, pipeLength)
    mockPipe.fill.color = "black"
    mockPipe.fill.opacity = 1
    this._group.add(mockPipe)

    let mockSnapArea1 = new Rect(this._layers[3], {x: position.x, y: position.y + pipeLength}, pipeWidth, snapWidth)
    mockSnapArea1.fill.color = "blue"
    mockSnapArea1.fill.opacity = 0.5;
    this._group.add(mockSnapArea1)

    let mockSnapArea2 = new Rect(this._layers[3], {x: position.x, y: position.y - snapWidth}, pipeWidth, snapWidth)
    mockSnapArea2.fill.color = "orange"
    mockSnapArea2.fill.opacity = 0.5
    this._group.add(mockSnapArea2)

    this._group.create()
    this._group.rotateAroundCenter(90);
    this._group.update()*/

    

    /*this._layers[3]
      .append("circle")
        .attr("cx", this._group.center.x) 
        .attr("cy", this._group.center.y)
        .attr("r", 2)
        .style("fill", "red")*/ 

    // add fluids to the fluid registery for use later
    FluidRegistry.register(new Fluid("Water", 2, -3, {red: 0, green: 0, blue: 200, alpha: 255}))
    //FluidRegistry.register(new Fluid("Smoke", -1, {red: 142, green: 140, blue: 145, alpha: 255}))
    FluidRegistry.register(new Fluid("Dust", 5, -1, {red: 173, green: 161, blue: 113, alpha: 255}))
    FluidRegistry.register(new Fluid("Magma", 1, -1, {red: 255, green: 0, blue: 0, alpha: 255}))
    //FluidRegistry.register(new Fluid("Nitrogen Gas", -2, {red: 0, green: 0, blue: 100, alpha: 255}))

    // setup the player 
    this._player = new Player(this); // contains inventory
    this._player.create()

    

    // setup the world
    this._world = new World(this, this._player, {x: 310, y: 20}, this._width - (310 + 400), this._height - 30)
    this._world.create()

    // setup the HUD
    this._hud = new HUD(this, this._player);
    this._hud.create()

    // add example items to the players inventory

    /*this._hud.inventory.add(new Valve(
      this._layers[1], 
        {
            x: this._hud.inventory.width + this.world.width/2,
            y: this.world.height/2
        },
        20, 10, 5
    ));*/
    this._hud.inventory.add(new Heater(this._layers[1], {x: 0, y: 0}, 40, 20));
    this._hud.inventory.add(new Heater(this._layers[1], {x: 0, y: 0}, 40, 20));
    this._hud.inventory.add(new Heater(this._layers[1], {x: 0, y: 0}, 40, 20));
    this._hud.inventory.add(new Heater(this._layers[1], {x: 0, y: 0}, 40, 20));
    this._hud.inventory.add(new Tank(this._layers[1], {x: 0, y: 0}, {width: 40, height: 100}, 5));
    this._hud.inventory.add(new Tank(this._layers[1], {x: 0, y: 0}, {width: 40, height: 100}, 5));
    this._hud.inventory.add(new Tank(this._layers[1], {x: 0, y: 0}, {width: 50, height: 50}, 5));
    
    //this._hud.inventory.add(new CrossPipe(this._layers[1], {x: 475, y: 540}, 10, 100, 5));
    this._hud.inventory.add(new Tank(this._layers[1], {x: 0, y: 0}, {width: 50, height: 50}, 5, true, false, false, false))
    this._hud.inventory.add(new Tank(this._layers[1], {x: 0, y: 0}, {width: 50, height: 100}, 5, false, false, false, false))
    this._hud.inventory.add(new Pipe(this._layers[1], {x: 0, y: 0}, 50, 10, 5));
    this._hud.inventory.add(new Pipe(this._layers[1], {x: 0, y: 0}, 50, 10, 5));
    this._hud.inventory.add(new Pipe(this._layers[1], {x: 0, y: 0}, 50, 10, 5));
    this._hud.inventory.add(new Pipe(this._layers[1], {x: 0, y: 0}, 50, 10, 5));
    this._hud.inventory.add(new Pipe(this._layers[1], {x: 0, y: 0}, 50, 10, 5));
    this._hud.inventory.add(new Pipe(this._layers[1], {x: 0, y: 0}, 50, 10, 5));
    this._hud.inventory.add(new Pump(this._layers[1], this._world, {x: 0, y: 0}, 6));
    this._hud.inventory.add(new Pump(this._layers[1], this._world, {x: 0, y: 0}, 5));
    this._hud.inventory.add(new Pump(this._layers[1], this._world, {x: 0, y: 0}, 15));

    this._hud.inventory.add(new Tank(this._layers[1], {x: 0, y: 0}, {width: 40, height: 40}, 5, false, false, false, false))
    this._hud.inventory.add(new Tank(this._layers[1], {x: 0, y: 0}, {width: 40, height: 40}, 5, false, false, false, true))
    this._hud.inventory.add(new Tank(this._layers[1], {x: 0, y: 0}, {width: 40, height: 40}, 5, false, false, false, true))
    this._hud.inventory.add(new Tank(this._layers[1], {x: 0, y: 0}, {width: 40, height: 40}, 5, false, false, false, true))
    /*this._hud.inventory.add(new ElbowPipe(
      this._layers[1],
      {x: 0, y: 0},
      5,
      50,
      5
    ))
    this._hud.inventory.add(new ElbowPipe(
      this._layers[1],
      {x: 0, y: 0},
      10,
      60,
      2
    ))
    this._hud.inventory.add(new ElbowPipe(
      this._layers[1],
      {x: 0, y: 0},
      5,
      50,
      5
    ))
    this._hud.inventory.add(new ElbowPipe(
      this._layers[1],
      {x: 0, y: 0},
      5,
      50,
      5
    ))*/
        
    // setup some starting tanks
    /*var sellTank = new Tank(
      svg, 
      {
        x: this.inventory.width + this.world.width/2 - 100, /* border width of sell button */
        /*y: this.inventory.height - 50 - 6 // Space for the button
      },
      {
        width: 200,
        height: 40
      },
      5
    );
    sellTank.wallColor = "red";*/


    //var startPump = new Pump(this._world, {x: 0, y: 0}, 10);
    //startPump.position.x = this.inventory.width + this.world.width/2 - startPump.width/2;
    //startPump.position.y = startPump.width + startPump.production;

    //var testValve = new Valve(
      //{x: this.world.width / 2, y: this.world.height / 2},
      //100, // width
      //10, // interiorHeight
      //5  // wallWidth
    //)


    //this._shop = new Shop();


    /*this._testTradeItem = new TradeItem(
      {x: 30, y: 30},
      50, 50, "Player", 100, 50);
    this._testTradeItem.create(d3.select("svg"))*/
    

    /*this._testBtn = new BorderedButton(
      {x: 100, y: 100},
      50, 50, 2
    )*/


    let self = this;
    d3.select("body").on("keydown", (event) => {
      self.onKeyPress(event)
    })
  }



  /**
   * create() 
   * @description creates the game 
   */
  create() {
    this._player.create()
    this._world.create()
    this._hud.create()
    //this._shop.create()
  }

  /**
   * update()
   * @description updates the game
   */
  update() {
    var self = this;
    setInterval(() => {
      self._world.update();
    }, 20);
  }

  /**
   * onKeyPress()
   * @description called when key is pressed
   */
  onKeyPress(event) {
    this._hud.inventory.onKeyPress(event);

    //console.log(event.key);
    if(event.key === 'r') {
      //console.log(this._player.hand);
      this._player.hand.rotate();
      this._player.hand.update();


      this._group.rotateAroundCenter(90);
      this._group.update()
    }
  }


  /**
   * get layers()
   * @description gets the graphic layers of the game 
   * @returns the graphic layers of the game
   */
  get layers() {
    return this._layers;
  }


  /**
   * get world()
   * @description gets the currently active world
   * @returns the currently active world
   */
  get world() {
    return this._world;
  }

  /**
   * get hud()
   * @description gets the hud
   * @returns the hud
   */
  get hud() {
    return this._hud;
  }


  /**
   * get height()
   * @description gets the height of the game
   * @returns the height of the game
   */
  get height() {
    return this._height;
  }

  /**
   * get width()
   * @description gets the width of the game
   * @returns the width of the game
   */
  get width() {
    return this._width;
  }
}
