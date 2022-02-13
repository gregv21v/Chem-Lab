/*
	Tank: a container for liquid

	Attaching pipes to tank:
		Each tank has a surface are that limits the number of pipes that can be
		connected to the tank. No two pipes can overlap.

		When a pipe is moved over a tank, its snapped to the nearest edge and follows
		along the edge of the tank until the mouse is moved a significant distance
		away from the tank.


		When an object is on the mouse it has particular interactions with the rest of the world
		objects.
*/
class Tank extends Snappable {
	constructor(center, interior, wallWidth) {
		super(center)
		this.currentLevel = 0;
		this.maxLevel = interior.width * interior.height;
		this.liquid = new Liquid(0, {red: 0, green: 0, blue: 0});
		this.interior = interior;
		this.wallWidth = wallWidth;
		this.position = center;
		this.orientation = "vertical"

		//this.snapPosition = {x: 0, y: 0};
		//this.snapping = false;

		this.wallColor = "green";
		this.active = false;
		this.text = "";
		var mainSVG = d3.select("body").select("svg")
		this.svg = {
			walls: mainSVG.append("rect"),
			interior: mainSVG.append("rect"),
			liquid: mainSVG.append("rect"),
			label: mainSVG.append("text")
		};
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
		return this.position.y + this.interior.height - this.getLiquidHeight();
	};

	/**
	 * createSVG()
	 * @description creates the graphic for the tank
	 */
	createSVG() {
		this.updateSVG();
	};

	/**
		topSnapBehaviour()
		@description determines what happens when an Snappable snaps to
			the top of another snappable
		@param snappable the Snappable being snapped to
		@param mousePos the current position of the mouse
	*/
	topSnapBehaviour(snappable, mousePos) {
		// Do Nothing
	}


	/**
		leftSnapBehaviour()
		@description determines what happens when an Snappable snaps to
		the left of another snappable
		@param snappable the Snappable being snapped to
		@param mousePos the current position of the mouse
	*/
	leftSnapBehaviour(snappable, mousePos) {
		var thisRect = this.getRect()
		var otherRect = snappable.getRect()
		// match this object with the left edge of
		// the other object
		this.moveRelativeToCenter({
			x: snappable.center.x - thisRect.width / 2,
			y: mousePos.y
		})
	}

	/**
		rightSnapBehaviour()
		@description determines what happens when an Snappable snaps to
		the right of another snappable
		@param snappable the Snappable being snapped to
		@param mousePos the current position of the mouse
	*/
	rightSnapBehaviour(snappable, mousePos) {
		var thisRect = this.getRect()
		var otherRect = snappable.getRect()

			console.log("This Rect: ");
			console.log(thisRect);
			console.log("Other Rect: ");
			console.log(otherRect);

		// match the right edge
		this.moveRelativeToCenter({
			x: snappable.center.x + otherRect.width + thisRect.width / 2,
			y: mousePos.y
		})
	}




	/**
		bottomSnapBehaviour()
		@description determines what happens when an Snappable snaps to
		the botttom of another snappable
		@param snappable the Snappable being snapped to
		@param mousePos the current position of the mouse
	*/
	bottomSnapBehaviour(snappable, mousePos) {}


	getSnapAreas() {
		return {
			left: this.getLeftArea(),
			right: this.getRightArea(),
			bottom: this.getBottomArea()
		}
	}

	updateSVG() {
		//this.position.x = this.center.x - this.getWidth()/2;
		//this.position.y = this.center.y - this.getHeight()/2;

		var self = this;

		this.tooltip.createSVG();

		// setup walls svg
		this.svg.walls.attr("height", this.getHeight());
		this.svg.walls.attr("width", this.getWidth());
		this.svg.walls.attr("x", this.position.x);
		this.svg.walls.attr("y", this.position.y);
		this.svg.walls.style("fill", this.wallColor);

		// setup interior svg
		this.svg.interior.attr("height", this.interior.height);
		this.svg.interior.attr("width", this.interior.width);
		this.svg.interior.attr("x", this.position.x + this.wallWidth);
		this.svg.interior.attr("y", this.position.y - this.wallWidth/2);
		this.svg.interior.style("fill", "white")
			.on("mouseenter", function() {
				self.tooltip.show();
			})
			.on("mouseout", function() {
				self.tooltip.hide();
			})


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

	updateLiquidSVG() {
		this.svg.liquid.attr("height", this.getLiquidHeight());
		this.svg.liquid.attr("y", this.getLiquidY());

		if(this.liquid)
			this.svg.liquid.style("fill", this.liquid.fill());

		this.svg.label.attr("x", this.position.x + this.getWidth()/2 - (this.text.length * 6)/2);
		this.svg.label.text(this.text);
	};

	destroySVG() {
		this.svg.walls.remove();
		this.svg.interior.remove();
		this.svg.liquid.remove();
	}

	/**
		transferLiquid()
		@description transfers liquid from the tank to its connecting pipes
	*/
	transferLiquid() {
		for(var side of Object.keys(this.attachments)) {
			for(var pipe of this.attachments[side]) {
				if(pipe instanceof Pipe) {
					var drop;

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
						} else if(side === "top") {
							drop.position = {
								x: pipe.position.x + drop.size/2,
								y: pipe.position.y
							}
						} else if(side === "bottom") {
							drop.position = {
								x: pipe.position.x + drop.size/2,
								y: pipe.position.y
							}
						}

						// create the drop in the world and add it to the respective pipe
						drop.createSVG();
						pipe.addDrop(drop, side);

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
	};


	/*
		A string of info used for creating a tooltip
	*/
	getName() {
		return "Tank";
	};



	getWidth() {
		return this.interior.width + this.wallWidth * 2;
	}

	getHeight() {
		return this.interior.height + this.wallWidth;
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
	};


	/*
		Empties the tank of all its liquid
	*/
	empty () {
		this.currentLevel = 0;
		this.liquid = null;
		this.text = ""

		this.updateLiquidSVG();
	};

}
