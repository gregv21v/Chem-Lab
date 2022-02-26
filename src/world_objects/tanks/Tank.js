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
import Drop from "../fluids/Drop";
import Fluid from "../fluids/Fluid";
import EmptyFluid from "../fluids/EmptyFluid";
import FluidBody from "../fluids/FluidBody";
import ContainerFluidBody from "../fluids/ContainerFluidBody";

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
		leftOpened=false, rightOpened=false, upOpened=true, downOpened=false
	) {
		super(center, {x: 0, y: 0}) 

		// the open and closes sides
		this._leftOpened = leftOpened;
		this._rightOpened = rightOpened;
		this._upOpened = upOpened;
		this._downOpened = downOpened;

		this._interior = interior;
		this._wallWidth = wallWidth;
		this._position = center;
		this._orientation = "vertical"

		this._wallColor = "green";
		this._active = false;
		this._text = "";

		this._emptyFluid = new ContainerFluidBody(
			{x: this._position.x + this._wallWidth, y: this._position.y + this._wallWidth}, // position
			interior.height * interior.width, // volume 
			new EmptyFluid() // fluid
		)
		
		// the list of fluids in the tank
		this._fluidBodies = [
			this._emptyFluid	
		] 
	}

	

	
	/**
	 * create()
	 * @description creates the Tank
	 */
	createSVG() {
		this._group = d3.select("body").select("svg").append("g")
		this._svg = {
			walls: this._group.append("rect"),
			interiorVertical: this._group.append("rect"),
			interiorHorizontal: this._group.append("rect"),
			fluids: this._group.append("g")
		};

		this._svg.walls.attr("name", "walls")
		this._svg.interiorHorizontal.attr("name", "interiorHorizontal")
		this._svg.interiorVertical.attr("name", "interiorVertical")
		this._svg.fluids.attr("name", "fluids")

		this._emptyFluid.create(this._svg.fluids)
		this._emptyFluid.container = this;

		this.updateSVG()
	}

  	/**
	 * updateSVG()
	 * @description renders the svg for the tan
	 */
	updateSVG() {
		//this._position.x = this.center.x - this.width/2;
		//this._position.y = this.center.y - this.height/2;
		//this.tooltip.createSVG();

		// setup walls svg
		this._svg.walls.attr("height", this.height);
		this._svg.walls.attr("width", this.width);
		this._svg.walls.attr("x", this._position.x);
		this._svg.walls.attr("y", this._position.y);
		this._svg.walls.style("fill", this._wallColor);
		

		// setup interior svg
		this._svg.interiorVertical.attr("height", this._interior.height);
		this._svg.interiorVertical.attr("width", this._interior.width);
		this._svg.interiorVertical.attr("x", this._position.x + this._wallWidth);

		this._svg.interiorVertical.style("fill", "white")

		this._svg.interiorHorizontal.attr("height", this._interior.height);
		this._svg.interiorHorizontal.attr("width", this._interior.width);
		this._svg.interiorHorizontal.attr("y", this._position.y + this._wallWidth)

		this._svg.interiorHorizontal.style("fill", "white")
    
		if(this._leftOpened) {
			this._svg.interiorHorizontal.attr("x", this._position.x);

			if(this._rightOpened) {
				this._svg.interiorHorizontal.attr("width", this._interior.width + this._wallWidth*2)
			}
		} else {
			this._svg.interiorHorizontal.attr("x", this._position.x + this._wallWidth);

			if(this._rightOpened) {
				this._svg.interiorHorizontal.attr("width", this._interior.width + this._wallWidth)
			}
		}

		if(this._upOpened) {
			this._svg.interiorVertical.attr("y", this._position.y);

			if(this._downOpened) {
				this._svg.interiorVertical.attr("height", this._interior.height + this._wallWidth * 2)
			}
		} else {
			this._svg.interiorVertical.attr("y", this._position.y + this._wallWidth)

			if(this._downOpened) {
				this._svg.interiorVertical.attr("height", this._interior.height + this._wallWidth)
			}
		}

		// setup liquid svg
		this.updateFluidBodies()

		// setup label svg
		//this._svg.label.attr("fill", "black");
		//this._svg.label.attr("x", this._position.x + this.width/2 - (this.text.length * 6)/2);
		//this._svg.label.attr("y", this._position.y + this.height/2);
	}

  	/**
	 * updateFluidBodies() 
	 * @description updates the svg for the liquid in the tank
	 */
	updateFluidBodies() {
		let lastY = this.getUpY()
		for (let fluidBody of this._fluidBodies) {
			fluidBody.position = {
				x: this._position.x + this._wallWidth,
				y: lastY
			}
			lastY = fluidBody.getButtomY()
			//console.log(lastY)
		}
	}
	

	/**
	 * removeVolumelessFluids()
	 * @description removes any fluids that have a volume of 0
	 */
	removeVolumelessFluids() {
		let newFluidBodies = [];
		for (const fluidBody of this._fluidBodies) {
			if(!(fluidBody.fluid instanceof EmptyFluid) && fluidBody.volume <= 0) {
				fluidBody.destroy()
			} else {
				newFluidBodies.push(fluidBody);
			}
		}

		this._fluidBodies = newFluidBodies;
	}

	/**
	 * addFluid()
	 * @description adds a fluid to the tank
	 * @param {Fluid} fluid the fluid to add to the tank
	 */
	/**
	 * new fluid("Water", 1, interior.width * 10, {red: 0, green: 0, blue: 256}),
			new fluid("Olive Oil", 5, interior.width * 10, {red: 0, green: 256, blue: 0})
	 */
	addFluid(newFluid) {

		// find the empty fluid
		let emptyFluid = this.getEmptyFluid()

		// add the fluid
		if(emptyFluid.volume > 0) {
			emptyFluid.volume -= newFluid.volume;

			// search through the fluids to find the new fluid
			let i = 0;
			while(i < this._fluidBodies.length && this._fluidBodies[i].fluid.name !== newFluid.fluid.name) {
				i++;
			}

			// if it doesn't exist add it
			if(i >= this._fluidBodies.length) {
				this._fluidBodies.push(newFluid);
				this._fluidBodies = this._fluidBodies.sort((a, b) => a.fluid.density - b.fluid.density) 
			} else { // otherwise combine the new fluid with the existing one
				this._fluidBodies[i].volume += newFluid.volume
			}
		}
			

		newFluid.create(this._svg.fluids);
		this.updateFluidBodies()
	}

	/**
	 * destroySVG()
	 * @description destroys the svg for the object
	 */
	destroySVG() {
		for (const part of Object.values(this._svg)) {
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
					let drop = null;
					let firstFluid = this.getFirstAccessibleFluid(pipe);
					

					// get a drop from the tank
					if(firstFluid) {
						let dropSize = pipe.getDropSize()
						//console.log(dropSize);
						drop = firstFluid.removeDrop(dropSize)

						if(drop) {
							this.removeVolumelessFluids()
							this._emptyFluid.addDrop(drop.size)
							this.updateFluidBodies();
						}
					}

					// if pipe is there, move the drop to the pipe
					if(drop) {
						// position drop at front of pipe
						if(side === "left") {
							drop.position = {
								x: pipe.position.x + pipe.width - drop.size/2,
								y: pipe.center.y - drop.size/2
							}
						} else if(side === "right") {
							drop.position = {
								x: pipe.position.x,
								y: pipe.center.y - drop.size/2
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
						drop.direction = side;
						pipe.addDrop(drop);

					}
				}
			}
		}
	}

	/**
	 * getEmptyFluid() 
	 * @description gets the empty fluid from the list of fluids
	 * @returns the empty fluid
	 */
	getEmptyFluid() {
		for (const body of this._fluidBodies) {
			if(body.fluid instanceof EmptyFluid) {
				return body;
			}
		}
	}


	/**
	 * createThumbnail() 
	 * @description create a little image of the tank
	 */


	/**
	 * getFirstAccessibleFluid()	
	 * @description Gets the fluid in the tank that the pipe can first access	
	 * @param {Pipe} pipe the pipe find 
	 * @returns true if the pipe has access to the fluid
	 * 			false if the pipe does not have access to the fluid
	 */
	getFirstAccessibleFluid(pipe) {

		// search throught the list of fluids to find the first 
		// accessible one by the pipe
		for (const fluidBody of this._fluidBodies) {
			if(!(fluidBody.fluid instanceof EmptyFluid) && pipe.rect.withinYRange(fluidBody.rect)) {
				return fluidBody;
			}
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
		// find the empty fluid
		let emptyFluid = this.getEmptyFluid()

		// add the fluid
		if(emptyFluid.volume > 0) {
			emptyFluid.volume -= drop.volume

			// search through the fluids to find the new fluid
			let i = 0;
			//console.log(this._fluidBodies)
			//console.log(drop);
			while(i < this._fluidBodies.length && this._fluidBodies[i].fluid.name !== drop.fluid.name) {
				i++;
			}

			// if it doesn't exist add it
			if(i >= this._fluidBodies.length) {
				let newFluid = new ContainerFluidBody({x: 0, y: 0}, drop.volume, drop.fluid);
				console.log("New Fluid")
				console.log(newFluid)
				newFluid.create(this._svg.fluids);
				newFluid.container = this;
				this._fluidBodies.push(newFluid);
				this._fluidBodies = this._fluidBodies.sort((a, b) => a.fluid.density - b.fluid.density) 
			} else { // otherwise combine the new fluid with the existing one
				this._fluidBodies[i].volume += drop.volume
			}
		}
			
		this.updateFluidBodies()
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
								drop.position.x >= this._position.x + this._wallWidth &&
							 	drop.position.x <= this._position.x + this._wallWidth + this._interior.width &&
							 	drop.position.y + drop.size >= this._position.y + this._interior.height &&
							 	drop.position.y + drop.size <= this._position.y + this._interior.height
							 )
								||
							 // bottom right
							 (
							 	drop.position.x + drop.size >= this._position.x + this._wallWidth &&
							 	drop.position.x + drop.size <= this._position.x + this._wallWidth + this._interior.width &&
							 	drop.position.y + drop.size >= this._position.y + this._interior.height &&
							 	drop.position.y + drop.size <= this._position.y + this._interior.height
							 )

		// if the this is empty, we pretend it has liquid level of 10.
							 // bottom left
		var withNoLiquid =  (
								drop.position.x >= this._position.x + this._wallWidth &&
							 	drop.position.x <= this._position.x + this._wallWidth + this._interior.width &&
							 	drop.position.y + drop.size >= this._position.y + this._interior.height - 10 &&
							 	drop.position.y + drop.size <= this._position.y + this._interior.height
							)
								||
							 // bottom right
							(
							 	drop.position.x + drop.size >= this._position.x + this._wallWidth &&
							 	drop.position.x + drop.size <= this._position.x + this._wallWidth + this._interior.width &&
							 	drop.position.y + drop.size >= this._position.y + this._interior.height - 10 &&
							 	drop.position.y + drop.size <= this._position.y + this._interior.height
							)
		return touchingLiquid || withNoLiquid;
	}

	

	/**
	 *	empty()
	 *	@description Empties the tank of all its liquid
	 */
	empty () {
		/**this.currentLevel = 0;
		this.liquid = null;
		this.text = ""

		this.updateFluidBodies();**/
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
			let thisRect = this.rect
			//let otherRect = snappable.rect

			this.orientation = "vertical"
			this.moveRelativeToCenter({
				y: snappable._center.y - thisRect.height / 2,
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
			let thisRect = this.rect
			// match this object with the left edge of
			// the other object
			this.moveRelativeToCenter({
				x: snappable._center.x - thisRect.width / 2,
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
			let thisRect = this.rect
			let otherRect = snappable.rect
			
			// match the right edge
			this.moveRelativeToCenter({
				x: snappable._center.x + otherRect.width + thisRect.width / 2,
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
			let thisRect = this.rect
			let otherRect = snappable.rect

			this.orientation = "vertical"
			this.moveRelativeToCenter({
				y: snappable._center.y + otherRect.height + thisRect.height / 2,
				x: mousePos.x
			})
		}
  	}

	/**
	 * getUpY()
	 * @description get the y value for the top of the tank, below the inner wall
	 */
	getUpY() {
		return this._position.y + this._wallWidth;
	}

	/**
	 * getDownY()
	 * @description get the y value for the bottom of the tank, below the inner wall
	 */
	getDownY() {
		return this._position.y + this._interior.height + this._wallWidth;
	}


	/**
	 * get name()
	 * @returns gets the name of the pipe
	 */
	get name() {
		let sidesOpen = "";
		sidesOpen += (this._leftOpened) ? "left " : ""
		sidesOpen += (this._rightOpened) ? "right " : ""
		sidesOpen += (this._upOpened) ? "up " : ""
		sidesOpen += (this._downOpened) ? "down " : ""

		return "Tank " + sidesOpen;
	}

	/**
	 * get interior()
	 * @description gets the interior dimensions of the tank
	 */
	get interior() {
		return this._interior;
	}

	/**
	 * get width()
	 * @description gets the width of the tank
	 * @returns the width of the tank
	 */
	get width() {
		return this._interior.width + this._wallWidth * 2;
	}

	/**
	 * get height()
	 * @description gets the height of the tank
	 * @returns height of the tank
	 */
	get height() {
		return this._interior.height + this._wallWidth * 2;
	}


	
	/** 
	 * get leftOpened()
	 * @description gets the left opened value
	 * @returns leftOpened
	 */
	get leftOpened() {
		return this._leftOpened;
	}

	/** 
	 * get rightOpened()
	 * @description gets the left opened value
	 * @returns rightOpened
	 */
	get rightOpened() {
		return this._rightOpened;
	}

	/** 
	 * get upOpened()
	 * @description gets the left opened value
	 * @returns upOpened
	 */
	get upOpened() {
		return this._upOpened;
	}

	/** 
	 * get downOpened()
	 * @description gets the left opened value
	 * @returns downOpened
	 */
	get downOpened() {
		return this._downOpened;
	}

	/**
	 * moveRelativeToCenter()
	 * @description moves the Snappable relative to it's center
	 * @param point point to move to
	 */
	moveRelativeToCenter(point) {
		this._position.x = point.x - this.width / 2
		this._position.y = point.y - this.height / 2

		this.updateFluidBodies()
	}

}