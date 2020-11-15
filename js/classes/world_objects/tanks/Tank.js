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



function Tank(center, interior, wallWidth)
{
	Snappable.call(this, center);

	this.connectedPipes = [];
	this.currentLevel = 0;
	this.maxLevel = interior.width * interior.height;
	this.liquid = new Liquid(0, {red: 0, green: 0, blue: 0});
	this.interior = interior;
	this.wallWidth = wallWidth;
	this.position = center;

	this.snapPosition = {x: 0, y: 0};
	this.snapping = false;

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

Tank.prototype = Object.create(Snappable.prototype);
Tank.prototype.constructor = Tank;


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


	this.updateSVG();

};

Tank.prototype.updateSVG = function() {
	this.position.x = this.center.x - this.getWidth()/2;
	this.position.y = this.center.y - this.getHeight()/2;

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

Tank.prototype.updateLiquidSVG = function() {
	this.svg.liquid.attr("height", this.getLiquidHeight());
	this.svg.liquid.attr("y", this.getLiquidY());

	if(this.liquid)
		this.svg.liquid.style("fill", this.liquid.fill());

	this.svg.label.attr("x", this.position.x + this.getWidth()/2 - (this.text.length * 6)/2);
	this.svg.label.text(this.text);
};

Tank.prototype.destroySVG = function() {
	this.svg.walls.remove();
	this.svg.interior.remove();
	this.svg.liquid.remove();
}

/*
	Checks to see if a given pipe can access the
	liquid in the tank.
*/
Tank.prototype.pipeCanAccessLiquid = function (pipe) {
	// the opening of the pipe is even with the
	// tanks liquid or above it.
	var pipeY = pipe.center.y + pipe.interiorHeight/2; // y bottom interior wall of pipe.
	if(pipeY > this.getLiquidY()) {
		return true;
	} else {
		return false;
	}

};

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
Tank.prototype.getName = function() {
	return "Tank";
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
