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
  constructor(layer, position, velocity, size, fluid) {
    super(layer, position, size, size, velocity, size * size, fluid)
    this._size = size;
    this._tempature = 0;

    /**
     * Will be removed in favor of velocity
     */
    this.direction = "" // the direction that the drop is traveling in
    this._stepAlongPath = -1;
  }

  /**
   * create() 
   * @description creates the graphics for the game object
   * @param {SVG} parent the parent svg
   */
  create() {
    this._group = d3.create("svg:g")

    this._svg = {
      rect: this._group.append("rect")
    };

    this._svg.rect.attr("name", "Drop")
    this._svg.rect.style("fill", this._fluid.getColorAsString())
    this._svg.rect.attr("x", this._position.x);
    this._svg.rect.attr("y", this._position.y);

    this.position = this._position;
    this.size = this._size

    this._layer.append(() => this._group.node())
  }


  /**
   * update() 
   * @description update the the drop
   */
  update(world) {
    let self = this;

    this.position = {
      x: this.position.x + this._velocity.x,
      y: this.position.y + this._velocity.y * this.fluid.density
    }

    this._svg.rect.attr("x", this._position.x);
    this._svg.rect.attr("y", this._position.y);


    // if the drop is outside the world remove it
  	if(!world.within({position: this.position, width: this.size, height: this.size})) {
  		world.removeDrop(this);
  		this.destroy();
  	} else { // drop is inside the world
  		// if in tank, remove drop and fill tank with size of drop
  		world.objs.forEach(function(obj) {

  			if (
          obj instanceof Tank && 
          obj.containsDrop(self) &&  
          ((obj.upOpened && self.fluid.density > 0) || // tank for liquids
          (obj.downOpened && self.fluid.density < 0)) // tank for gases
        ) {
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
   * turn()
   * @description turns the drop
   * @param {Direction} direction direction to turn the drop
   */
  turn(direction) {
    let directions = ["up", "left", "down", "right"]

    let index = directions.indexOf(this.direction);
    console.log(directions[index]);
    if(direction === "left") {
      this.direction = directions[(index + 1) % directions.length]
    } else {
      this.direction = directions[(index - 1) % directions.length]
    }
  }


  /**
   * heat()
   * @description heats the drop
   * @param {Number} amount the amount to increase the drops tempature by
   */
  heat(amount) {
    this._tempature += amount;
  }

  /**
   * cool()
   * @description cools the drop
   * @param {Number} amount the amount to decrease the drops tempature by
   */
  cool(amount) {
    this._tempature -= amount;
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


  /**
   * get stepAlongPath()
   * @description gets the stop along the path that the drop is currently taking
   * @returns step along path
   */
  get stepAlongPath() {
    return this._stepAlongPath;
  }


  /**
   * set stepAlongPath()
   * @description sets the step along the path that the drop is currently taking
   * @param {Integer} value the step along the path
   */
  set stepAlongPath(value) {
    this._stepAlongPath = value;
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

}
