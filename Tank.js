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











function Tank(position, interior, wallWidth)
{
	this.currentLevel = 0;
	this.maxLevel = interior.width * interior.height;
	this.interior = interior;
	this.wallWidth = wallWidth;
	this.position = position;
	this.wallColor = "green";
	this.liquidColor = "blue";
	this.active = false;
	this.svg = {
		walls: document.createElementNS("http://www.w3.org/2000/svg", "rect"),
		interior: document.createElementNS("http://www.w3.org/2000/svg", "rect"),
		liquid: document.createElementNS("http://www.w3.org/2000/svg", "rect")
	};
	this.snapAreas = {
		left: {
			external: null,
			internal: null
		},
		right: {
			external: null,
			internal: null
		},
		bottom: {
			external: null,
			internal: null
		}
		
	};


	// initial update
	this.updateSnapAreas();
}

Tank.prototype.getPercentageFull = function() {
	return (100 * this.currentLevel/this.maxLevel);
};
Tank.prototype.getLiquidY = function() {
	return this.position.y + this.interior.height - this.getPercentageFull();
};
Tank.prototype.createSVG = function() {

	var SVGMain = document.getElementById("main");

	this.updateSVG();

	SVGMain.appendChild(this.svg.walls);
	SVGMain.appendChild(this.svg.interior);
	SVGMain.appendChild(this.svg.liquid);
};
Tank.prototype.updateSVG = function() {
	// setup walls svg
	this.svg.walls.setAttribute("height", this.interior.height + this.wallWidth);
	this.svg.walls.setAttribute("width", this.interior.width + (this.wallWidth*2));
	this.svg.walls.setAttribute("x", this.position.x);
	this.svg.walls.setAttribute("y", this.position.y);
	this.svg.walls.setAttribute("fill", this.wallColor);

	// setup interior svg
	this.svg.interior.setAttribute("height", this.interior.height);
	this.svg.interior.setAttribute("width", this.interior.width);
	this.svg.interior.setAttribute("x", this.position.x + this.wallWidth);
	this.svg.interior.setAttribute("y", this.position.y - this.wallWidth/2);
	this.svg.interior.setAttribute("fill", "white"); // should be the same as the background

	// setup liquid svg
	this.svg.liquid.setAttribute("width", this.interior.width);
	this.svg.liquid.setAttribute("height", this.getPercentageFull());
	this.svg.liquid.setAttribute("x", this.position.x + this.wallWidth);
	this.svg.liquid.setAttribute("y", this.getLiquidY());
	this.svg.liquid.setAttribute("fill", this.liquidColor);
}


Tank.prototype.updateLiquidSVG = function() {
	this.svg.liquid.setAttribute("height", this.getPercentageFull());
	this.svg.liquid.setAttribute("y", this.getLiquidY());
};

Tank.prototype.destroySVG = function() {
	this.svg.walls.remove();
	this.svg.interior.remove();
	this.svg.liquid.remove();
}

Tank.prototype.addLiquid = function(amount) {
	if(this.currentLevel + amount < this.maxLevel)
		this.currentLevel += amount;
	else
		this.currentLevel = this.maxLevel;
};

/*
	Checks to see if the bottom two corners of a drop are in the liquid 
	near the bottom of the tank
*/
Tank.prototype.containsDrop = function(drop) {
	// Either the drop is in the bottom of the tank, or touching the 
	// liquid
	// one or both of the bottom two corners of the drop are in the liquid
						 // bottom left
	var touchingLiquid = (
							drop.position.x >= this.position.x + this.wallWidth &&
						 	drop.position.x <= this.position.x + this.wallWidth + this.interior.width &&
						 	drop.position.y + drop.size >= this.position.y + this.interior.height - this.getPercentageFull() &&
						 	drop.position.y + drop.size <= this.position.y + this.interior.height
						 )
							||
						 // bottom right
						 (
						 	drop.position.x + drop.size >= this.position.x + this.wallWidth &&
						 	drop.position.x + drop.size <= this.position.x + this.wallWidth + this.interior.width &&
						 	drop.position.y + drop.size >= this.position.y + this.interior.height - this.getPercentageFull() &&
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
Tank.prototype.getInfo = function() {
	return this.interior.width + "x" + this.interior.height;
};



Tank.prototype.getWidth = function() {
	return this.interior.width + this.wallWidth*2;
}

Tank.prototype.getHeight = function() {
	return this.interior.height + this.wallWidth;
}

Tank.prototype.getRect = function() {
	return new Tank(this.position, this.interior.width + this.wallWidth * 2, this.interior.height + this.wallWidth);
};

/*
	Updates the areas around the tank and inside the tank that will be used for attaching 
	pipes to tanks.

*/ 
Tank.prototype.updateSnapAreas = function(side) {
	var internalWidth = this.getWidth()/2;
	var externalWidth = 15;


	// left
	this.snapAreas.left.external = new Rect(
			{x: this.position.x - externalWidth, y: this.position.y},
			externalWidth,
			this.getHeight(),
			"orange",
			1
		);

	this.snapAreas.left.internal = new Rect(
			{x: this.position.x, y: this.position.y},
			internalWidth,
			this.getHeight() - internalWidth,
			"pink",
			0.5
		);

	// right
	this.snapAreas.right.external = new Rect(
			{x: this.position.x + this.getWidth(), y: this.position.y},
			externalWidth,
			this.getHeight(),
			"orange",
			1
		);

	this.snapAreas.right.internal = new Rect(
			{x: this.position.x + internalWidth, y: this.position.y},
			internalWidth,
			this.getHeight() - internalWidth,
			"yellow",
			0.5
		);

	// bottom
	this.snapAreas.bottom.external = new Rect(
			{x: this.position.x, y: this.position.y + this.getHeight()},
			this.getWidth(),
			externalWidth,
			"orange",
			1
		);

	// bottom
	this.snapAreas.bottom.internal = new Rect(
			{x: this.position.x, y: this.position.y + this.getHeight() - internalWidth},
			this.getWidth(),
			internalWidth,
			"blue",
			0.5
		);


};


Tank.prototype.showSnapArea = function() {
	// external 
	this.snapAreas.left.external.createSVG();
	this.snapAreas.right.external.createSVG();
	this.snapAreas.bottom.external.createSVG();

	// internal
	this.snapAreas.left.internal.createSVG();
	this.snapAreas.right.internal.createSVG();
	this.snapAreas.bottom.internal.createSVG();
};

Tank.prototype.hideSnapArea = function() {
	// external
	this.snapAreas.left.external.destroySVG();
	this.snapAreas.right.external.destroySVG();
	this.snapAreas.bottom.external.destroySVG();

	// internal
	this.snapAreas.left.internal.destroySVG();
	this.snapAreas.right.internal.destroySVG();
	this.snapAreas.bottom.internal.destroySVG();
}


