/*
  Tank - a sided tank is a tank with the ability
  of choosing which side or sides are open.

  Attaching pipes to tank:
		Each tank has a surface are that limits the number of pipes that can be
		connected to the tank. No two pipes can overlap.

		When a pipe is moved over a tank, its snapped to the nearest edge and follows
		along the edge of the tank until the mouse is moved a significant distance
		away from the tank.


		When an object is on the mouse it has particular interactions with the rest of the world
		objects.
*/

import * as d3 from "d3"
import Snappable from "../Snappable";
import Pipe from "../Pipe";
import Drop from "../Drop";
import Liquid from "../../Liquid";

export default class Tank extends Snappable {

  /**
   * constructor()
   * @description constructs the sided tank
   * @param {Point} center the center of the tank
   * @param {Object (width, height)} interior the interior width and height of the tank
	 * @param {Number} wallWidth the width of the walls of the tank
   * @param {Boolean} leftOpen indicates whether the left side is opened
   * @param {Boolean} rightOpen indicates whether the right side is opened
   * @param {Boolean} upOpen indicates whether the up side is opened
   * @param {Boolean} downOpen indicates whether the down side is opened
   */
  constructor(
	  center, interior, wallWidth, 
	  leftOpened=false, rightOpened=false, upOpened=true, downOpened=false) {
    super(center) 

    this._chemicals = [] // the list of chemicals

    // the open and closes sides
    this._leftOpened = leftOpened;
    this._rightOpened = rightOpened;
    this._upOpened = upOpened;
    this._downOpened = downOpened;

    this.currentLevel = 0;
	this.maxLevel = interior.width * interior.height;
	this.liquid = new Liquid(0, {red: 0, green: 0, blue: 0});
	this.interior = interior;
	this.wallWidth = wallWidth;
	this.position = center;
	this.orientation = "vertical"

	this.wallColor = "green";
	this.active = false;
	this.text = "";
  }


  	/**
	 * getLiquidHeight()
	 * @description gets the height of the liquid in the tank
	 * @returns the liquid's height in the tank
	 */
	getLiquidHeight () {
		return this.interior.height * this.currentLevel / this.maxLevel;
	};

	/**
	 * getLiquidY()
	 * @description gets the y position of the liquid in the tank
	 * @returns the liquid's y position
	 */
	getLiquidY() {
		return this.position.y + this.interior.height - this.getLiquidHeight() + this.wallWidth;
	};

	/**
	 * create()
	 * @description creates the Tank
	 */
	createSVG() {
		let mainSVG = d3.select("body").select("svg")
		this.svg = {
			walls: mainSVG.append("rect"),
			interiorVertical: mainSVG.append("rect"),
			interiorHorizontal: mainSVG.append("rect"),
			liquid: mainSVG.append("rect"),
			label: mainSVG.append("text")
		};

		this.updateSVG()
	}

  	/**
	 * updateSVG()
	 * @description renders the svg for the tan
	 */
	updateSVG() {
		//this.position.x = this.center.x - this.getWidth()/2;
		//this.position.y = this.center.y - this.getHeight()/2;
		this.tooltip.createSVG();

		// setup walls svg
		this.svg.walls.attr("height", this.getHeight());
		this.svg.walls.attr("width", this.getWidth());
		this.svg.walls.attr("x", this.position.x);
		this.svg.walls.attr("y", this.position.y);
		this.svg.walls.style("fill", this.wallColor);

		// setup interior svg
		this.svg.interiorVertical.attr("height", this.interior.height);
		this.svg.interiorVertical.attr("width", this.interior.width);
		this.svg.interiorVertical.attr("x", this.position.x + this.wallWidth);

		this.svg.interiorVertical.style("fill", "white")

		this.svg.interiorHorizontal.attr("height", this.interior.height);
		this.svg.interiorHorizontal.attr("width", this.interior.width);
		this.svg.interiorHorizontal.attr("y", this.position.y + this.wallWidth)

		this.svg.interiorHorizontal.style("fill", "white")
    


		if(this._leftOpened) {
			this.svg.interiorHorizontal.attr("x", this.position.x);

			if(this._rightOpened) {
				this.svg.interiorHorizontal.attr("width", this.interior.width + this.wallWidth*2)
			}
		} else {
			this.svg.interiorHorizontal.attr("x", this.position.x + this.wallWidth);

			if(this._rightOpened) {
				this.svg.interiorHorizontal.attr("width", this.interior.width + this.wallWidth)
			}
		}

		if(this._upOpened) {
			this.svg.interiorVertical.attr("y", this.position.y);

			if(this._downOpened) {
				this.svg.interiorVertical.attr("height", this.interior.height + this.wallWidth * 2)
			}
		} else {
			this.svg.interiorVertical.attr("y", this.position.y + this.wallWidth)

			if(this._downOpened) {
				this.svg.interiorVertical.attr("height", this.interior.height + this.wallWidth)
			}
		}

		// setup liquid svg
		this.svg.liquid.attr("width", this.interior.width);
		this.svg.liquid.attr("height", this.getLiquidHeight());
		this.svg.liquid.attr("x", this.position.x + this.wallWidth);
		this.svg.liquid.attr("y", this.getLiquidY());
		this.svg.liquid.style("fill", this.liquid.fill());

		// setup label svg
		this.svg.label.attr("fill", "black");
		this.svg.label.attr("x", this.position.x + this.getWidth()/2 - (this.text.length * 6)/2);
		this.svg.label.attr("y", this.position.y + this.getHeight()/2);
	}

  	/**
	 * updateLiquidSVG() 
	 * @description updates the svg for the liquid in the tank
	 */
	updateLiquidSVG() {
		this.svg.liquid.attr("height", this.getLiquidHeight());
		this.svg.liquid.attr("y", this.getLiquidY());

		if(this.liquid)
			this.svg.liquid.style("fill", this.liquid.fill());

		this.svg.label.attr("x", this.position.x + this.getWidth()/2 - (this.text.length * 6)/2);
		this.svg.label.text(this.text);
	}

	/**
	 * destroySVG()
	 * @description destroys the svg for the object
	 */
	destroySVG() {
		for (const part of Object.values(this.svg)) {
			part.remove()
		}
	}

  	/**
	 * getSnapAreas() 
	 * @description gets the snap areas for the tank
	 * @returns snap areas for the tank
	 */
	getSnapAreas() {
		return {
			left: this.getLeftArea(),
			right: this.getRightArea(),
			down: this.getDownArea(),
      		up: this.getUpArea()
		}
	}


  	/**
	 *	transferLiquid()
	 *	@description transfers liquid from the tank to its connecting pipes
	 */
	transferLiquid() {
		for(const side of Object.keys(this.attachments)) {
			for(const pipe of this.attachments[side]) {
				if(pipe instanceof Pipe) {
					let drop;

					// get a drop from the tank
					if(this.pipeCanAccessLiquid(pipe)) {
						drop = this.getDrop(pipe.getDropSize())
					} else {
						drop = null;
					}


					// if pipe is there, move the drop to the pipe
					if(drop) {
						//console.log(.size);
						// position drop at front of pipe
						if(side === "left") {
							drop.position = {
								x: pipe.position.x + pipe.getWidth() - drop.size/2,
								y: pipe.getCenter().y - drop.size/2
							}
						} else if(side === "right") {
							drop.position = {
								x: pipe.position.x,
								y: pipe.getCenter().y - drop.size/2
							}
						} else if(side === "up") {
							drop.position = {
								x: pipe.position.x + drop.size/2,
								y: pipe.position.y
							}
						} else if(side === "down") {
							drop.position = {
								x: pipe.position.x + drop.size/2,
								y: pipe.position.y
							}
						}

						// create the drop in the world and add it to the respective pipe
						drop.createSVG();
						drop.direction = side;
						pipe.addDrop(drop);

					}
				}
			}
		}
	}

	/**
	 * pipeCanAccessLiquid()	
	 * @description Checks to see if a given pipe can access the
		liquid in the tank.	
	 * @param {Pipe} pipe the pipe to check access to
	 * @returns true if the pipe has access to the liquid
	 * 			false if the pipe does not have access to the liquid
	 */
	pipeCanAccessLiquid (pipe) {
		// the opening of the pipe is even with the
		// tanks liquid or above it.
		var pipeY = pipe.getCenter().y + pipe.interiorHeight/2; // y bottom interior wall of pipe.
		if(pipeY > this.getLiquidY()) {
			return true;
		} else {
			return false;
		}

	};

	/**
	 * addDrop()	
	 * @description adds a drop to the tank
	 * @param {Drop} drop the drop to add to the tank
	 * @returns true if the tank isn't full
	 * 			false if the tank is full
	 */
	addDrop(drop) {
		console.log("Adding Drop");

		// Handle liquid coloring and value
		if(this.currentLevel == 0) {
			this.liquid = drop.liquid;
		} else if(this.currentLevel + drop.getVolume() <= this.maxLevel) {
			this.liquid = Liquid.mix(this.liquid, drop.liquid);
		}

		// Handle liquid level
		if(this.currentLevel + drop.getVolume() <= this.maxLevel) {
			this.currentLevel += drop.getVolume();
			this.text = "" + (this.currentLevel * this.liquid.value);
			return true;
		} else {
			return false;
		}

		// show percentage full ==> "(" + this.currentLevel + "/" + this.maxLevel + ")"

	};

	/**
		containsDrop()
		@description Checks to see if the bottom two corners of a drop are in the liquid
		near the bottom of the tank

		TODO: convert this to be more readable and elegant.
	*/
	containsDrop(drop) {
		// Either the drop is in the bottom of the tank, or touching the
		// liquid
		// one or both of the bottom two corners of the drop are in the liquid
							 // bottom left
		var touchingLiquid = (
								drop.position.x >= this.position.x + this.wallWidth &&
							 	drop.position.x <= this.position.x + this.wallWidth + this.interior.width &&
							 	drop.position.y + drop.size >= this.position.y + this.interior.height - this.getLiquidHeight() &&
							 	drop.position.y + drop.size <= this.position.y + this.interior.height
							 )
								||
							 // bottom right
							 (
							 	drop.position.x + drop.size >= this.position.x + this.wallWidth &&
							 	drop.position.x + drop.size <= this.position.x + this.wallWidth + this.interior.width &&
							 	drop.position.y + drop.size >= this.position.y + this.interior.height - this.getLiquidHeight() &&
							 	drop.position.y + drop.size <= this.position.y + this.interior.height
							 )

		// if the this is empty, we pretend it has liquid level of 10.
							 // bottom left
		var withNoLiquid =  (
								drop.position.x >= this.position.x + this.wallWidth &&
							 	drop.position.x <= this.position.x + this.wallWidth + this.interior.width &&
							 	drop.position.y + drop.size >= this.position.y + this.interior.height - 10 &&
							 	drop.position.y + drop.size <= this.position.y + this.interior.height
							)
								||
							 // bottom right
							(
							 	drop.position.x + drop.size >= this.position.x + this.wallWidth &&
							 	drop.position.x + drop.size <= this.position.x + this.wallWidth + this.interior.width &&
							 	drop.position.y + drop.size >= this.position.y + this.interior.height - 10 &&
							 	drop.position.y + drop.size <= this.position.y + this.interior.height
							)
		return touchingLiquid || withNoLiquid;
	}


	/*
		A string of info used for creating a tooltip
	*/
	getName() {
		return "Tank";
	}

	/**
	 * getWidth()
	 * @description gets the width of the tank
	 * @returns the width of the tank
	 */
	getWidth() {
		return this.interior.width + this.wallWidth * 2;
	}

	/**
	 * getHeight()
	 * @description gets the height of the tank
	 * @returns height of the tank
	 */
	getHeight() {
		return this.interior.height + this.wallWidth * 2;
	}

	/*
		Get the liquid in the tank.
	*/
	getLiquid () {
		return {
			amount: this.currentLevel,
			type: this.liquid
		}
	}

  	/**
	 * getDrop()
	 * @description gets a drop from the tank of size size
	 * @param {number} size the size of the drop
	 * @returns a new drop of size size 
	 */
	getDrop (size) {
		if(size * size <= this.currentLevel) {
			this.currentLevel -= size * size;
			this.text = "" + (this.currentLevel * this.liquid.value);
			this.updateLiquidSVG();
			var drop = new Drop({x: 0, y: 0}, size, this.liquid);
			if(this.currentLevel == 0) {
				this.liquid = null;
			}
			return drop;
		} else
			return null;
	}


	/**
	 *	empty()
	 *	@description Empties the tank of all its liquid
	 */
	empty () {
		this.currentLevel = 0;
		this.liquid = null;
		this.text = ""

		this.updateLiquidSVG();
	};


  /**
		topSnapBehaviour()
		@description determines what happens when an Snappable snaps to
			the top of another snappable
		@param snappable the Snappable being snapped to
		@param mousePos the current position of the mouse
	*/
	upSnapBehaviour(snappable, mousePos) {
		if(!this._upOpened) {
			let thisRect = this.getRect()
			//let otherRect = snappable.getRect()

			this.orientation = "vertical"
			this.moveRelativeToCenter({
				y: snappable.center.y - thisRect.height / 2,
				x: mousePos.x
			})
		}
	}


	/**
		leftSnapBehaviour()
		@description determines what happens when an Snappable snaps to
		the left of another snappable
		@param snappable the Snappable being snapped to
		@param mousePos the current position of the mouse
	*/
	leftSnapBehaviour(snappable, mousePos) {
		if(!this._leftOpened) {
			let thisRect = this.getRect()
			// match this object with the left edge of
			// the other object
			this.moveRelativeToCenter({
				x: snappable.center.x - thisRect.width / 2,
				y: mousePos.y
			})
		}
	}

	/**
		rightSnapBehaviour()
		@description determines what happens when an Snappable snaps to
		the right of another snappable
		@param snappable the Snappable being snapped to
		@param mousePos the current position of the mouse
	*/
	rightSnapBehaviour(snappable, mousePos) {
		if(!this._rightOpened) {
			let thisRect = this.getRect()
			let otherRect = snappable.getRect()
			
			// match the right edge
			this.moveRelativeToCenter({
				x: snappable.center.x + otherRect.width + thisRect.width / 2,
				y: mousePos.y
			})
		}
	}

	/**
		bottomSnapBehaviour()
		@description determines what happens when an Snappable snaps to
		the botttom of another snappable
		@param snappable the Snappable being snapped to
		@param mousePos the current position of the mouse
	*/
	downSnapBehaviour(snappable, mousePos) {
		if(!this._downOpened) {
			let thisRect = this.getRect()
			let otherRect = snappable.getRect()

			this.orientation = "vertical"
			this.moveRelativeToCenter({
				y: snappable.center.y + otherRect.height + thisRect.height / 2,
				x: mousePos.x
			})
		}
  	}
}