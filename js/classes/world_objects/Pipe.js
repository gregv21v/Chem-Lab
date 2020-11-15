/*
	Pipe: a conduett for moving liquid
	from one tank to another.

*/

function Pipe(center, width, interiorHeight, wallWidth)
{
	Snappable.call(this, center);
	this.connectedTanks = [];
	this.wallWidth = wallWidth;
	this.interiorHeight = interiorHeight;
	this.position = {x: 0, y: 0}
	//this.center = center; // position of pipe
	this.width = width;

	this.currentLevel = 0;
	this.drops = [];

	// gui components
	//this.tooltip = new ToolTip(this.position, "Pipes transport liquid")

	//this.snapCenter = {x: 0, y: 0}; // position of pipe when in the snapping region.
	//this.snapping = false;

	var mainSVG = d3.select("body").select("svg")
	this.svg = {
		walls: mainSVG.append("rect"),
		interior: mainSVG.append("rect")
	}


	this.position = {x: 0, y: 0};
	this.rect = this.getRect();
	this.updatePosition();

	// call the constructor of the base class
	//console.log("Pipe Constructor");

}

Pipe.prototype = Object.create(Snappable.prototype);
Pipe.prototype.constructor = Pipe;





Pipe.prototype.addDrop = function (drop, direction) {
	this.drops.push({
		drop: drop,
		direction: direction
	})
};

/*
	Adds back a drop that was retrieved from
	the spout.
*/
Pipe.prototype.addDropBack = function (drop) {
	this.drops.push(drop);
};

/*
	Here is where the liquid comes out of the Pipe
	and can be collected by another tank or something else.
*/
Pipe.prototype.spout = function () {
	// search for available drops
	var leakingDrops = []; // drops at their exit.
	var keptDrops = [];
	for(var x in this.drops) {
		// if a drop can no longer flow in the direction it was
		// flowing, give it is at its spout, and ready to leak.
		if(!this.drops[x].drop.canFlow(this, this.drops[x].direction)) {
			leakingDrops.push(this.drops[x]);
		} else {
			keptDrops.push(this.drops[x]);
		}
	}
	this.drops = keptDrops;
	return leakingDrops;
};


Pipe.prototype.updateDrops = function () {
	for(var x in this.drops) {
		if(this.drops[x].drop.canFlow(this, this.drops[x].direction)) {
			this.drops[x].drop.flow(this, this.drops[x].direction);
		}
	}
};

/*
	=============Drawing the Pipe=============
*/
Pipe.prototype.createSVG = function() {
	var SVGMain = document.getElementById("main");

	this.updateSVG();

};

GameObject.prototype.updateTooltip = function () {
  this.tooltip.position = this.position;
	this.updatePosition();
};

Pipe.prototype.updateSVG = function() {
	this.updatePosition();

	this.tooltip.createSVG();

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
/*
	==========================================
*/

Pipe.prototype.setOrientation = function (orientation) {
	this.orientation = orientation;
	this.updateSnapAreas();
	this.updatePosition();
};

Pipe.prototype.updatePosition = function() {
	if(!this.snapping) {
		this.position.x = this.center.x - this.getWidth()/2;
		this.position.y = this.center.y - this.getHeight()/2;
	} else {
		this.position.x = this.snapCenter.x - this.getWidth()/2;
		this.position.y = this.snapCenter.y - this.getHeight()/2;
	}
}

/*
	Switch the pipe too and from horizontal and vertical orientation.
*/
Pipe.prototype.rotate = function() {
	if(this.orientation === "horizontal") {
		this.setOrientation("vertical");
	} else {
		this.setOrientation("horizontal");
	}
}



/************************************************
	Physical Properties
************************************************/
Pipe.prototype.getHeight = function() {
	if(this.orientation === "horizontal") {
		return this.interiorHeight + this.wallWidth * 2;
	} else {
		return this.width;
	}
};

Pipe.prototype.getWidth = function() {
	if(this.orientation === "horizontal") {
		return this.width;
	} else {
		return this.interiorHeight + this.wallWidth * 2;
	}
};

Pipe.prototype.getDropSize = function () {
	return this.interiorHeight;
};



Pipe.prototype.getName = function () {
	return "Pipe";
};






Pipe.prototype.getRect = function() {
	this.updatePosition();
	var newRect = new Rect();
	newRect.position = this.position

	if(this.orientation === "horizontal") {
		newRect.width = this.getHeight(); // horizontal dimension
		newRect.height = this.getWidth(); // vertical dimension
	} else if(this.orientation === "vertical") {
		newRect.width = this.getWidth(); // horizontal dimension
		newRect.height = this.getHeight(); // vertical dimension
	}
	return newRect;
};




Pipe.prototype.attachTo = function (tank, side) {
	this.connectedTanks.push({
		tank: tank,
		side: side
	});
};
