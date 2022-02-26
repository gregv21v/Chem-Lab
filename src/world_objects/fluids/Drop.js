/*
	Drop - the smallest unit of liquid

  Behavior: falls until it reaches the bottom of a tank. At that point,
	it enters the tank.
*/

import Tank from "../tanks/Tank";
import * as d3 from "d3"
import FluidBody from "./FluidBody";

export default class Drop extends FluidBody {
  /**
   * constructor()
   * @description constructs the drop
   * @param {Point} position the position of the drop in the world
   * @param {Point} velocity the velocity of the drop
   */
  constructor(position, velocity, size, fluid) {
    super(position, velocity, size * size, fluid)
    this._size = size;

    /**
     * Will be removed in favor of velocity
     */
    this.direction = "" // the direction that the drop is traveling in
  }

  /**
   * create() 
   * @description creates the graphics for the game object
   * @param {SVG} parent the parent svg
   */
  create(parent) {
    this._group = d3.create("svg:g")

    this._svg = {
      rect: this._group.append("rect")
    };

    this._svg.rect.attr("name", "Drop")
    this._svg.rect.style("fill", this._fluid.getColorAsString())

    this.position = this._position;
    this.size = this._size


    parent.append(() => this._group.node())
  }



  /**
   * getVolume()
   * @returns the volume of the drop
   * @deprecated in favor of get volume()
   */
  getVolume() {
    return this._size * this._size;
  }

  /**
   * get volume()
   * @returns the volume of the drop
   */
  get volume() {
    return this._size * this._size;
  }



  /**
   * update() 
   * @description update the the drop
   */
  update(world) {
    let self = this;

    this.position = {
      x: this.position.x + this._velocity.x,
      y: this.position.y + this._velocity.y
    }


    // if the drop is outside the world remove it
  	if(!world.within({position: this.position, width: this.size, height: this.size})) {
  		world.removeDrop(this);
  		this.destroy();
  	} else { // drop is inside the world
  		// if in tank, remove drop and fill tank with size of drop
  		world.objs.forEach(function(obj) {

  			if(obj instanceof Tank && obj.containsDrop(self) && obj.upOpened) {
          // add the drop to the tank
  				obj.addDrop(self);  

  				// remove drop from world
  				world.removeDrop(self);
  				self.destroy();

  				return;
  			}
  		})
  	}
  }

  /*
    Causes the drop to flow through a pipe.
    This called every update.
    directions: up, down, left, right
  */
  flow() {
    if(this.direction === "up") {
      this.position.y -= 1
    }
    if(this.direction === "down") {
      this.position.y += 1
    }
    
    if(this.direction === "left") {
      this.position.x -= 1
    }
    
    if(this.direction === "right") {
      this.position.x += 1
    }

    this._svg.rect.attr("x", this.position.x)
    this._svg.rect.attr("y", this.position.y)
  };


  /*
    Checks to see if the drops can flow.

    Behavior: drops flow down and to the right.
  */
  canFlow(pipe) {
    if(this.direction === "up") {
      // make sure the drop is below the pipes upper edge
      if(this.position.y - 1 < pipe.center.y - pipe.height/2 - this.size) {
        return false;
      }
    }
    if(this.direction === "down") {
      // make sure the drop is below the pipes lower edge
      if(this.position.y + 1 > pipe.center.y + pipe.height/2 - this.size) {
        return false;
      }
    } else if(this.direction === "left") {
      // make sure the drop is below the pipes left edge
      if(this.position.x - 1 < pipe.center.x - pipe.width/2) {
        return false;
      }
    }
    else if(this.direction === "right") {
      // make sure the drop is below the pipes right edge
      if(this.position.x + 1 > pipe.center.x + pipe.width/2 - this.size) {
        return false;
      }
    }
    return true;
  }


  /**
   * set size()
   * @description sets the size of the drop
   * @param {Number} size the size to set the drop to
   */
  set size(value) {
    this._size = value;
    

    this._svg.rect.attr("width", this._size);
  	this._svg.rect.attr("height", this._size);
  }

  /**
   * get size()
   * @description gets the size
   * @returns the drops size
   */
  get size() {
    return this._size;
  }


}
