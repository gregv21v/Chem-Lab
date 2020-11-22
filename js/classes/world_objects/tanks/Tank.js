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
class Tank extends LiquidContainer {
	constructor(position, width, height, wallWidth) {
		super(position)
		this.currentLevel = 0;
		this.maxLevel = (width - wallWidth * 2) * (height - wallWidth);
		this.liquid = new Liquid(0, {red: 0, green: 0, blue: 0});
		this.width = width;
		this.height = height;
		this.wallWidth = wallWidth;
		this.position = position;


		this.wallColor = "green";
		this.active = false;
		this.text = "";
	}

	getPercentFull() {
		return this.currentLevel / this.maxLevel;
	}

	getLiquidHeight () {
		return (this.height - this.wallWidth) * this.getPercentFull();
	};

	getLiquidY() {
		return (this.height - this.wallWidth) * (1 - this.getPercentFull());
	};

	getLiquidWorldY() {
		return this.position.y + (this.height - this.wallWidth) * (1 - this.getPercentFull())
	}

	createSVG() {
		var mainSVG = d3.select("body").select("svg")
		this.group = mainSVG.append("g")
		this.svg = {
			walls: this.group.append("rect"),
			interior: this.group.append("rect"),
			liquid: this.group.append("rect"),
			label: this.group.append("text")
		};
	};

	updateSVG() {
		let rotationX = this.getWidth() / 2
		let rotationY = this.getHeight() / 2
    let transformStr = "translate(" + this.position.x + "," + this.position.y + ") "
    transformStr += "rotate(" + this.rotation + "," + rotationX + "," + rotationY + ")"

		this.group.attr("transform", transformStr)

		// setup walls svg
		this.svg.walls
			.attr("height", this.height)
			.attr("width", this.width)
			.attr("x", 0)
			.attr("y", 0)
			.style("fill", this.wallColor)

		// setup interior svg
		this.svg.interior
			.attr("height", (this.height - this.wallWidth) )
			.attr("width", (this.width - this.wallWidth * 2) )
			.attr("x", this.wallWidth)
			.attr("y", 0)
			.style("fill", "white")


		// setup liquid svg
		this.svg.liquid
			.attr("width", this.width - this.wallWidth * 2)
			.attr("height", this.getLiquidHeight())
			.attr("x", this.wallWidth)
			.attr("y", this.getLiquidY())
			.style("fill", this.liquid.fill())

		// setup label svg
		this.svg.label
			.attr("fill", "black")
			.attr("x", this.width/2 - (this.text.length * 6)/2)
			.attr("y", this.height/2)
	}

	updateLiquidSVG() {
		this.svg.liquid
			.attr("height", this.getLiquidHeight())
			.attr("y", this.getLiquidY())

		if(this.liquid)
			this.svg.liquid
				.style("fill", this.liquid.fill());

		this.svg.label
			.attr("x", this.position.x + this.getWidth()/2 - (this.text.length * 6)/2)
			.text(this.text)
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


	getSnapAreas() {
		return {
			left: this.getLeftArea(),
			right: this.getRightArea(),
			bottom: this.getBottomArea()
		}
	}



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
					// get a drop from the tank
					if(pipe.canAccessLiquid(this)) {
						var drop = this.getDrop(pipe.getDropSize())
						pipe.addDrop(drop, side);
					}
				}
			}
		}
	}




	addDrop(drop, side = "") {
		// Handle liquid coloring and value
		if(this.currentLevel == 0) {
			this.liquid = drop.liquid;
		} else if(this.currentLevel + drop.getVolume() <= this.maxLevel) {
			this.liquid = Liquid.mix(this.liquid, drop.liquid);
		}

		drop.destroySVG();
		this.updateLiquidSVG();

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
		getInnerWidth()
		@description the inner portion of the tanks width

	*/
	getInnerWidth() {
		return this.diameter - this.wallWidth * 2;
	}

	getLiquidRect() {
		var liquidRect = new Rect()
		liquidRect.width = this.getInnerWidth();
		liquidRect.height = this.getLiquidHeight();
		liquidRect.position = {
			x: this.position.x + this.wallWidth,
			y: this.getLiquidWorldY()
		}

		return liquidRect
	}

	/*
		Checks to see if the bottom two corners of a drop are in the liquid
		near the bottom of the tank

		TODO: convert this to be more readable and elegant.
	*/
	containsDrop(drop) {
		var dropRect = drop.getRect()
		var liquidRect = this.getLiquidRect();

		// check to see if the drop is either in or touching the existing
		// liquid
		if(liquidRect.intersects(dropRect)) {
			return true;
		}

		// if the tank is empty add the drop when it reaches the bottom
		// of the tank
		if(this.currentLevel == 0) {
			liquidRect.height = 2
			liquidRect.position.y -= 1
			if(liquidRect.intersects(dropRect)) {
				return true;
			}
		}

		return false;
	};


	/*
		A string of info used for creating a tooltip
	*/
	getName() {
		return "Tank";
	};



	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
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
