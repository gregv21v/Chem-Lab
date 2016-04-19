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
	this.connectedPipes = [];
	this.currentLevel = 0;
	this.maxLevel = interior.width * interior.height;
	this.liquid = new Liquid(0, {red: 0, green: 0, blue: 0});
	this.interior = interior;
	this.wallWidth = wallWidth;
	this.position = position;
	this.snapPosition = {x: 0, y: 0};
	this.snapping = false;
	this.wallColor = "green";
	this.active = false;
	this.text = "";
	this.svg = {
		walls: document.createElementNS("http://www.w3.org/2000/svg", "rect"),
		interior: document.createElementNS("http://www.w3.org/2000/svg", "rect"),
		liquid: document.createElementNS("http://www.w3.org/2000/svg", "rect"),
		label: document.createElementNS("http://www.w3.org/2000/svg", "text")
	};
	this.snapAreas = {
		bottom: new Rect(),
		left: new Rect(),
		right: new Rect()
	}

	// color bottom snap area
	this.snapAreas.bottom.stroke.width = 1;
	this.snapAreas.bottom.stroke.color = "black";
	this.snapAreas.bottom.fill.color = "green";
	this.snapAreas.bottom.fill.opacity = 0.5;

	// color left snap area
	this.snapAreas.left.stroke.width = 1;
	this.snapAreas.left.stroke.color = "black";
	this.snapAreas.left.fill.color = "green";
	this.snapAreas.left.fill.opacity = 0.5;

	// color right snap area
	this.snapAreas.right.stroke.width = 1;
	this.snapAreas.right.stroke.color = "black";
	this.snapAreas.right.fill.color = "green";
	this.snapAreas.right.fill.opacity = 0.5;




	// initial update
	this.updateSnapAreas();
}

Tank.prototype.attachTo = function (pipe, side) {
	this.connectedPipes.push({
		pipe: pipe,
		side: side
	});
};

Tank.prototype.centerAt = function (point) {
	this.position.x = point.x - this.getWidth()/2;
	this.position.y = point.y - this.getHeight()/2;

	this.updateSVG();
};

Tank.prototype.getLiquidHeight = function () {
	return this.interior.height * this.currentLevel / this.maxLevel;
};

Tank.prototype.getLiquidY = function() {
	return this.position.y + this.interior.height - this.getLiquidHeight();
};

Tank.prototype.createSVG = function() {

	var SVGMain = document.getElementById("main");

	this.updateSVG();

	SVGMain.appendChild(this.svg.walls);
	SVGMain.appendChild(this.svg.interior);
	SVGMain.appendChild(this.svg.liquid);
	SVGMain.appendChild(this.svg.label);
};

Tank.prototype.updateSVG = function() {
	// setup walls svg
	this.svg.walls.setAttribute("height", this.getHeight());
	this.svg.walls.setAttribute("width", this.getWidth());
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
	this.svg.liquid.setAttribute("height", this.getLiquidHeight());
	this.svg.liquid.setAttribute("x", this.position.x + this.wallWidth);
	this.svg.liquid.setAttribute("y", this.getLiquidY());
	this.svg.liquid.setAttribute("fill", this.liquid.fill());

	// setup label svg
	this.svg.label.setAttribute("fill", "black");
	this.svg.label.setAttribute("x", this.position.x + this.getWidth()/2 - (this.text.length * 6)/2);
	this.svg.label.setAttribute("y", this.position.y + this.getHeight()/2);
}

Tank.prototype.updateLiquidSVG = function() {
	this.svg.liquid.setAttribute("height", this.getLiquidHeight());
	this.svg.liquid.setAttribute("y", this.getLiquidY());

	if(this.liquid)
		this.svg.liquid.setAttribute("fill", this.liquid.fill());

	this.svg.label.setAttribute("x", this.position.x + this.getWidth()/2 - (this.text.length * 6)/2);
	this.svg.label.textContent = this.text;
};

Tank.prototype.destroySVG = function() {
	this.svg.walls.remove();
	this.svg.interior.remove();
	this.svg.liquid.remove();
}

Tank.prototype.addDrop = function(drop) {
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

/*
	Checks to see if the bottom two corners of a drop are in the liquid
	near the bottom of the tank

	TODO: convert this to be more readable and elegant.
*/
Tank.prototype.containsDrop = function(drop) {
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
Tank.prototype.getInfo = function() {
	return this.interior.width + "x" + this.interior.height;
};



Tank.prototype.getWidth = function() {
	return this.interior.width + this.wallWidth*2;
}

Tank.prototype.getHeight = function() {
	return this.interior.height + this.wallWidth;
}

/*
	Get a rectangle representing the tank.
*/
Tank.prototype.getRect = function() {
	var newRect = new Rect();
	newRect.position = this.position;
	newRect.width = this.getWidth();
	newRect.height = this.getHeight();
	return newRect;
};

/*
	Gets the center of the tank
*/
Tank.prototype.getCenter = function () {
	return {
		x: this.position.x + (this.getWidth()) / 2,
		y: this.position.y + (this.getHeight()) / 2,
	};
};


/*
	Get the liquid in the tank.
*/
Tank.prototype.getLiquid = function () {
	return {
		amount: this.currentLevel,
		type: this.liquid
	}
}

Tank.prototype.getDrop = function (size) {
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
Tank.prototype.empty = function () {
	this.currentLevel = 0;
	this.liquid = null;
	this.text = ""

	this.updateLiquidSVG();
};



/*
	Updates the areas around the tank and inside the tank that will be used for attaching
	pipes to tanks.

	(note: maybe combining solution 2, with the phantom pipe)
	There are two possible alternatives to the snap areas.

	A circlular snap area.
	A a bunch of rectanglar snap areas
*/
Tank.prototype.updateSnapAreas = function() {
	var externalWidth = 15;

	// left
	this.snapAreas.left.position = {x: this.position.x - externalWidth, y: this.position.y};
	this.snapAreas.left.width = externalWidth;
	this.snapAreas.left.height = this.getHeight();

	// right
	this.snapAreas.right.position = {x: this.position.x + this.getWidth(), y: this.position.y};
	this.snapAreas.right.width = externalWidth;
	this.snapAreas.right.height = this.getHeight();

	// bottom
	this.snapAreas.bottom.position = {x: this.position.x, y: this.position.y + this.getHeight()};
	this.snapAreas.bottom.width = this.getWidth();
	this.snapAreas.bottom.height = externalWidth;

};


/*
	Update the snap area SVG's
*/
Tank.prototype.updateSnapAreasSVG = function () {
	this.snapAreas.left.updateSVG();
	this.snapAreas.right.updateSVG();
	this.snapAreas.bottom.updateSVG();
};

/*
	Shows the snap area for the tank. Used
	for debugging purposes.
*/
Tank.prototype.showSnapAreas = function () {
	this.snapAreas.left.createSVG();
	this.snapAreas.right.createSVG();
	this.snapAreas.bottom.createSVG();
};

/*
	Hides the snap area for the tank. Used
	for debugging purposes.
*/
Tank.prototype.hideSnapAreas = function () {
	this.snapAreas.left.destroySVG();
	this.snapAreas.right.destroySVG();
	this.snapAreas.bottom.destroySVG();
};
