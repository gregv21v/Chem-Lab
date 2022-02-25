/**
 * Pipe - a pipe
 */

import Snappable from "./Snappable"
import Tank from "./tanks/Tank"
import * as d3 from "d3"
import Rect from "../shapes/Rect";

export default class Pipe extends Snappable {

  constructor(center, width, interiorHeight, wallWidth) {
    super(center)

  	this.wallWidth = wallWidth;
  	this.interiorHeight = interiorHeight;
  	this.position = center
  	//this.center = center; // position of pipe
  	this.width = width;

  	this.currentLevel = 0;
  	this.drops = [];

  	this._group = d3.select("body").select("svg").append("g")
  	this.svg = {
  		walls: this._group.append("rect"),
  		interior: this._group.append("rect")
  	}

	this.svg.walls.attr("name", "pipeWalls")
	this.svg.interior.attr("name", "pipeInterior")

  	this._rect = new Rect(this.position, this.getWidth(), this.getHeight());
  	//this.updatePosition();

  }

  /**
   * get rect()
   * @description gets the rect for this pipe
   */
  get rect() {
	this._rect.position = this.position;
	this._rect.width = this.getWidth()
	this._rect.height = this.getHeight()
	return this._rect
  }

  /**
   * @description adds a drop to the pipe
   * @param {Drop} drop the drop to add
   */
  addDrop (drop) {
  	this.drops.push(drop)
  };

  /**
  	takeExitingDrops()
  	@description takes the exiting drops from the pipe
  */
  takeExitingDrops(side) {
  	// search for available drops
  	var exitingDrops = []; // drops at their exit.
  	var keptDrops = []; // drops that are not about to exit
  	for(const drop of this.drops) {
		//debugger
		//console.log(drop);
  		// if a drop can no longer flow in the direction it was
  		// flowing, give it is at its spout, and ready to leak.
  		if(!drop.canFlow(this) && side === drop.direction) {
  			exitingDrops.push(drop);
			console.log("Direction: " + drop.direction)
			console.log("Exiting");
  		} else {
  			keptDrops.push(drop);
  		}
  	}
  	this.drops = keptDrops;
  	return exitingDrops;
  };


  /**
   * updateDrops()
   * @description update the drops
   */
  updateDrops () {
  	for(const x in this.drops) {
  		if(this.drops[x].canFlow(this)) {
  			this.drops[x].flow(this);
  		}
  	}
  };

  /*
  	=============Drawing the Pipe=============
  */
  createSVG() {
  	this.updateSVG();
  }




  updateSVG() {
  	//this.updatePosition();

  	if(this.orientation === "horizontal") {
  		// interior
  		this.svg.interior.attr("width", this.width);
  		this.svg.interior.attr("height", this.interiorHeight);
  		this.svg.interior.attr("x", this.position.x);
  		this.svg.interior.attr("y", this.position.y + this.wallWidth);
  	} else {
  		// interior
  		this.svg.interior.attr("width", this.interiorHeight);
  		this.svg.interior.attr("height", this.width);
  		this.svg.interior.attr("x", this.position.x + this.wallWidth);
  		this.svg.interior.attr("y", this.position.y);
  	}

  	// walls
  	this.svg.walls.attr("width", this.getWidth());
  	this.svg.walls.attr("height", this.getHeight());
  	this.svg.walls.attr("x", this.position.x);
  	this.svg.walls.attr("y", this.position.y);
  	this.svg.walls.style("fill", "black")
  				  .style("fill-opacity", 1)


  	// interior
  	this.svg.interior.style("fill", "white")
  					 .style("fill-opacity", 1)

  }

  destroySVG() {
	this._group.remove()
  }
  /*
  	==========================================
  */

  setOrientation (orientation) {
  	this.orientation = orientation;
  	//this.updatePosition();
  };


  /*
  	Switch the pipe too and from horizontal and vertical orientation.
  */




  /************************************************
  	Physical Properties
  ************************************************/
  getHeight() {
  	if(this.orientation === "horizontal") {
  		return this.interiorHeight + this.wallWidth * 2;
  	} else {
  		return this.width;
  	}
  };

  getWidth() {
  	if(this.orientation === "horizontal") {
  		return this.width;
  	} else {
  		return this.interiorHeight + this.wallWidth * 2;
  	}
  };

  getDropSize() {
  	return this.interiorHeight;
  };

  getSnapAreas() {
    if(this.orientation === "horizontal") {
      return {
        left: this.getLeftArea(),
        right: this.getRightArea()
      }
    } else if(this.orientation === "vertical") {
      return {
        up: this.getUpArea(),
        down: this.getDownArea()
      }
    }

  }


  getName() {
  	return "Pipe";
  };

  /**
    transferLiquid()
    @description transfers liquid to connected tanks
  */
  transferLiquid() {
    for(const side of Object.keys(this.attachments)) {
		for(const tank of this.attachments[side]) { // for each tank attached to this pipe
			if(tank instanceof Tank) {
				let exitingDrops = this.takeExitingDrops(side); // take the exiting drops
				for(const drop of exitingDrops) {
					tank.addDrop(drop);
					drop.destroySVG()
					tank.updateFluidsSVG()
				}
     		}
      	}
    }
  }


}
