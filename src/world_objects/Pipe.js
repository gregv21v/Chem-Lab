/**
 * Pipe - a pipe
 */

import Snappable from "./Snappable"
import Tank from "./tanks/Tank"
import * as d3 from "d3"
import Rect from "../shapes/Rect";

export default class Pipe extends Snappable {

	/**
	 * constructor()
	 * @description constructs the pipe
	 * @param {Vector} center the center of the pipe
	 * @param {Number} width the width of the pipe
	 * @param {Number} interiorHeight the interior height of the pipe
	 * @param {Number} wallWidth the wall width of the pipe
	 */
	constructor(center, width, interiorHeight, wallWidth) {
		super(center)

		this._wallWidth = wallWidth;
		this._interiorHeight = interiorHeight;
		this._position = center
		//this.center = center; // position of pipe
		this._width = width;

		this._drops = [];

		this._group = d3.select("body").select("svg").append("g")
		this._svg = {
			walls: this._group.append("rect"),
			interior: this._group.append("rect")
		}

		this._svg.walls.attr("name", "pipeWalls")
		this._svg.interior.attr("name", "pipeInterior")

		this._rect = new Rect(this.position, this.width, this.height);

		//this.updatePosition();

  	}

	

	/**
	 * @description adds a drop to the pipe
	 * @param {Drop} drop the drop to add
	 */
	addDrop (drop) {
		this._drops.push(drop)
	};

	/**
		takeExitingDrops()
		@description takes the exiting drops from the pipe
	*/
	takeExitingDrops(side) {
		// search for available drops
		var exitingDrops = []; // drops at their exit.
		var keptDrops = []; // drops that are not about to exit
		for(const drop of this._drops) {
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
		this._drops = keptDrops;
		return exitingDrops;
	};


	/**
	 * updateDrops()
	 * @description update the drops
	 */
	updateDrops () {
		for(const x in this._drops) {
			if(this._drops[x].canFlow(this)) {
				this._drops[x].flow();
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
			//let extraWidth = (this.attachments.right && this.attachments.right[0].wallWidth) ? this.attachments.right[0].wallWidth : 0
			//console.log(extraWidth);


			// interior
			this._svg.interior.attr("width", this._width + extraWidth);
			this._svg.interior.attr("height", this._interiorHeight);
			this._svg.interior.attr("x", this._position.x);
			this._svg.interior.attr("y", this._position.y + this._wallWidth);
		} else {
			// interior
			this._svg.interior.attr("width", this._interiorHeight);
			this._svg.interior.attr("height", this._width);
			this._svg.interior.attr("x", this._position.x + this._wallWidth);
			this._svg.interior.attr("y", this._position.y);
		}

		// walls
		this._svg.walls.attr("width", this.width);
		this._svg.walls.attr("height", this.height);
		this._svg.walls.attr("x", this._position.x);
		this._svg.walls.attr("y", this._position.y);
		this._svg.walls.style("fill", "black")
					.style("fill-opacity", 1)


		// interior
		this._svg.interior.style("fill", "white")
						.style("fill-opacity", 1)

	}

	destroySVG() {
		this._group.remove()
	}
	/*
		==========================================
	*/

	/**
	 * set orientation()
	 * @description sets the orientation of the pipe
	 */
	set orientation(value) {
		this._orientation = value;
	}

	/**
	 * get orientation()
	 * @description gets the orientation of the pipe
	 * @returns orientation of the pipe
	 */
	get orientation() {
		return this._orientation;
	}


	/*
		Switch the pipe too and from horizontal and vertical orientation.
	*/




	/************************************************
		Physical Properties
	************************************************/
	

  

	getDropSize() {
		return this._interiorHeight;
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


  

  	/***
   	 * transferLiquid()
   	 * @description transfers liquid to connected tanks
  	 */
  	transferLiquid() {
		for(const side of Object.keys(this.attachments)) {
			for(const tank of this.attachments[side]) { // for each tank attached to this pipe
				if(tank instanceof Tank) {
					let exitingDrops = this.takeExitingDrops(side); // take the exiting drops
					for(const drop of exitingDrops) {
						tank.addDrop(drop);
						drop.destroy()
						tank.updateFluidBodies()
					}
				}
			}
		}
  	}

  	/**
	 * get rect()
	 * @description gets the rect for this pipe
	 */
	get rect() {
		this._rect.position = this.position;
		this._rect.width = this.width
		this._rect.height = this.height
		return this._rect
	}

	/**
	 * get name()
	 * @returns gets the name of the pipe
	 */
	get name() {
		return "Pipe";
	}

	/**
	 * get height()
	 * @returns the height of the pipe
	 */
	get height() {
		if(this.orientation === "horizontal") {
			return this._interiorHeight + this._wallWidth * 2;
		} else {
			return this._width;
		}
	}
  
	/**
	 * get width()
	 * @returns the width of the pipe
	 */
	get width() {
		if(this.orientation === "horizontal") {
			return this._width;
		} else {
			return this._interiorHeight + this._wallWidth * 2;
		}
	}


}
