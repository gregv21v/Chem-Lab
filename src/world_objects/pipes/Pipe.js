/**
 * Pipe - a pipe
 */

import Snappable from "../Snappable"
import Tank from "../tanks/Tank"
import * as d3 from "d3"
import Rect from "../../shapes/Rect"

export default class Pipe extends Snappable {

	/**
	 * constructor()
	 * @description constructs the pipe
	 * @param {Point} center the center of the pipe
	 * @param {Number} length the length of the pipe
	 * @param {Number} diameter the interior height of the pipe
	 * @param {Number} wallWidth the wall width of the pipe
	 */
	constructor(center, length, diameter, wallWidth) {
		super(center)

		this._wallWidth = wallWidth;
		this._diameter = diameter;
		this._position = center
		//this.center = center; // position of pipe
		this._length = length;

		this._drops = [];
		this._rect = new Rect(this.position, this.width, this.height);
  	}

	
	/*
		=============Drawing the Pipe=============
	*/

	/**
	 * createSVG()
	 * @description creates the svg 
	 */
	createSVG() {
		this._group = d3.select("body").select("svg").append("g")
		this._svg = {
			walls: this._group.append("rect"),
			interior: this._group.append("rect")
		}

		this._svg.walls.attr("name", "pipeWalls")
		this._svg.interior.attr("name", "pipeInterior")

		this.updateSVG();
	}


	/**
	 * updateSVG()
	 * @description updates the svg 
	 */
	updateSVG() {
		//this.updatePosition();

		if(this.orientation === "horizontal") {
			// interior
			this._svg.interior.attr("width", this._length);
			this._svg.interior.attr("height", this._diameter);
			this._svg.interior.attr("x", this._position.x);
			this._svg.interior.attr("y", this._position.y + this._wallWidth);
		} else {
			// interior
			this._svg.interior.attr("width", this._diameter);
			this._svg.interior.attr("height", this._length);
			this._svg.interior.attr("x", this._position.x + this._wallWidth);
			this._svg.interior.attr("y", this._position.y);
		}

		// walls
		this._svg.walls.attr("width", this.width);
		this._svg.walls.attr("height", this.height);
		this._svg.walls.attr("x", this._position.x);
		this._svg.walls.attr("y", this._position.y);
		this._svg.walls
			.style("fill", "black")
			.style("fill-opacity", 1)


		// interior
		this._svg.interior
			.style("fill", "white")
			.style("fill-opacity", 1)

	}

	/**
	 * destroySVG()
	 * @description removes the svg group from the svg
	 */
	destroySVG() {
		this._group.remove()
	}


	/**
	 * @description adds a drop to the pipe
	 * @param {Drop} drop the drop to add
	 */
	addDrop (drop) {
		this._drops.push(drop)
	};

	/**
	 * takeExitingDrops()
	 * @description takes the exiting drops from the pipe
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



	/************************************************
		          Physical Properties
	************************************************/
	

  
	/**
	 * getDropSize()
	 * @description gets the max drop size that fits this pipe
	 * @returns the drop size
	 */
	getDropSize() {
		return this._diameter;
	};

	/**
	 * getSnapAreas()
	 * @description gets the snap areas for this pipe
	 * @returns the snap areas for this pipe
	 */
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


	/**
	 * getPath()
	 * @description get the path that a fluid will follow through the pipe
	 */
	getPath() {
		let path = [];
		if(this.orientation === "vertical") {
			path.push({
				x: this.position.x + this.diameter / 2, 
				y: this.position.y
			})
			path.push({
				x: this.position.x + this.diameter / 2,
				y: this.position.y + this._length
			})
		} else {
			path.push({
				x: this.position.x, 
				y: this.position.y + this.diameter / 2
			})
			path.push({
				x: this.position.x + this._length,
				y: this.position.y +  this.diameter / 2
			})
		}
		return path;
	}

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
			return this._diameter + this._wallWidth * 2;
		} else {
			return this._length;
		}
	}
  
	/**
	 * get width()
	 * @returns the width of the pipe
	 */
	get width() {
		if(this.orientation === "horizontal") {
			return this._length;
		} else {
			return this._diameter + this._wallWidth * 2;
		}
	}


}
