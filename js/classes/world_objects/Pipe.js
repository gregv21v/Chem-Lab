/*
	Pipe: a conduett for moving liquid
	from one tank to another.

*/

function Pipe(center, width, interiorHeight, wallWidth)
{
	GameObject.call(this, center);
	this.connectedTanks = [];
	this.wallWidth = wallWidth;
	this.interiorHeight = interiorHeight;
	this.position = {x: 0, y: 0}
	//this.center = center; // position of pipe
	this.width = width;

	this.currentLevel = 0;
	this.drops = [];

	//this.snapCenter = {x: 0, y: 0}; // position of pipe when in the snapping region.
	//this.snapping = false;


	this.svg = {
		interior: document.createElementNS("http://www.w3.org/2000/svg", "rect"),
		walls: document.createElementNS("http://www.w3.org/2000/svg", "rect")
	}

	this.alignment = "vertical";
	this.snapAreas = {
		first: new Rect(), // the
		second: new Rect() // also the
	};

	// color first snap areas
	this.snapAreas.first.stroke.width = 1;
	this.snapAreas.first.stroke.color = "black";
	this.snapAreas.first.fill.color = "orange";
	this.snapAreas.first.fill.opacity = 0.5;

	// color second snap area
	this.snapAreas.second.stroke.width = 1;
	this.snapAreas.second.stroke.color = "black";
	this.snapAreas.second.fill.color = "orange";
	this.snapAreas.second.fill.opacity = 0.5;


	this.position = {x: 0, y: 0};
	this.rect = this.getRect();
	this.updatePosition();
	this.updateSnapAreas();

	// call the constructor of the base class
	console.log("Pipe Constructor");

}

//Pipe.prototype = Object.create(GameObject.prototype);
//Pipe.prototype.constructor = Pipe;

/*
	Checks to see if this pipe snaps to a tank, and return
	the side the tank is on.

	Returns: side that the tank is on
*/
Pipe.prototype.snapTo = function (tank) {
	/*
		Left snapping region check.
	*/
	if(tank.snapAreas.left.intersects(this.getRect())) {
		this.setAlignment("horizontal");

		// set the snapping position to the left edge of the
		// tank closest to the pipe.
		this.snapCenter.x = tank.position.x	- this.getWidth()/2;
		this.snapCenter.y = this.center.y;

		// tank is one the right side
		return "right";
	}

	/*
		Right snapping region check.
	*/
	if(tank.snapAreas.right.intersects(this.getRect())) {
		this.setAlignment("horizontal");

		// set the snapping position to the right edge of the
		// tank closest to the pipe.
		this.snapCenter.x = tank.position.x + tank.getWidth()	+ this.getWidth()/2;
		this.snapCenter.y = this.center.y;

		// tank is one the left side
		return "left";
	}

	/*
		Bottom snapping region check.
	*/
	if(tank.snapAreas.bottom.intersects(this.getRect())) {
		this.setAlignment("vertical");

		// set the snapping position to the bottom edge of the
		// tank closest to the this.
		this.snapCenter.x = this.center.x;
		this.snapCenter.y = tank.position.y + tank.getHeight() + this.getHeight()/2;

		// tank is one the up side
		return "up";
	}

	return "";
};



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

	SVGMain.appendChild(this.svg.walls);
	SVGMain.appendChild(this.svg.interior);
};

Pipe.prototype.updateSVG = function() {
	this.updatePosition();

	if(this.alignment === "horizontal") {
		// interior
		this.svg.interior.setAttribute("width", this.width);
		this.svg.interior.setAttribute("height", this.interiorHeight);
		this.svg.interior.setAttribute("x", this.position.x);
		this.svg.interior.setAttribute("y", this.position.y + this.wallWidth);
	} else {
		// interior
		this.svg.interior.setAttribute("width", this.interiorHeight);
		this.svg.interior.setAttribute("height", this.width);
		this.svg.interior.setAttribute("x", this.position.x + this.wallWidth);
		this.svg.interior.setAttribute("y", this.position.y);
	}

	// walls
	this.svg.walls.setAttribute("width", this.getWidth());
	this.svg.walls.setAttribute("height", this.getHeight());
	this.svg.walls.setAttribute("x", this.position.x);
	this.svg.walls.setAttribute("y", this.position.y);
	this.svg.walls.setAttribute("fill", "black");

	// interior
	this.svg.interior.setAttribute("fill", "white");

}
/*
	==========================================
*/

Pipe.prototype.setAlignment = function (alignment) {
	this.alignment = alignment;
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
	Switch the pipe too and from horizontal and vertical alignment.
*/
Pipe.prototype.rotate = function() {
	if(this.alignment === "horizontal") {
		this.setAlignment("vertical");
	} else {
		this.setAlignment("horizontal");
	}
}



/************************************************
	Physical Properties
************************************************/
Pipe.prototype.getHeight = function() {
	if(this.alignment === "horizontal") {
		return this.interiorHeight + this.wallWidth * 2;
	} else {
		return this.width;
	}
};

Pipe.prototype.getWidth = function() {
	if(this.alignment === "horizontal") {
		return this.width;
	} else {
		return this.interiorHeight + this.wallWidth * 2;
	}
};

Pipe.prototype.getDropSize = function () {
	return this.interiorHeight;
};


/*
	Info used for creating a tooltip
*/
Pipe.prototype.getInfo = function() {
	return "Pipe => Interior Height: " + this.interiorHeight + ", Width: " + this.width;
};

Pipe.prototype.getRect = function() {
	this.updatePosition();
	var newRect = new Rect();
	newRect.position = {
		x: this.position.x,
		y: this.position.y
	};
	newRect.width =	this.getWidth();
 	newRect.height = this.getHeight();
	return newRect;
};


/************************************************
	Snapping
************************************************/
Pipe.prototype.updateSnapAreas = function () {
	var externalWidth = 15;

	if(this.alignment === "horizontal") {
		this.snapAreas.first.width = externalWidth;
		this.snapAreas.first.height = this.getHeight();

		this.snapAreas.second.width = externalWidth;
		this.snapAreas.second.height = this.getHeight();

		// left
		this.snapAreas.first.position = {
				x: this.position.x - externalWidth,
				y: this.position.y
		};


		// right
		this.snapAreas.second.position = {
				x: this.position.x + this.getWidth(),
				y: this.position.y
		};

	} else if(this.alignment === "vertical") {
		this.snapAreas.first.width = this.getWidth();
		this.snapAreas.first.height = externalWidth;

		this.snapAreas.second.width =	this.getWidth();
		this.snapAreas.second.height = externalWidth;

		// top
		this.snapAreas.first.position = {
				x: this.position.x,
				y: this.position.y - externalWidth
		};

		// bottom
		this.snapAreas.second.position = {
				x: this.position.x,
				y: this.position.y + this.getHeight()
		};

	}
};


/*
	Gets the orientation of the pipe:
		Left - Right

*/
Pipe.prototype.getOrientation = function () {

};

Pipe.prototype.attachTo = function (tank, side) {
	this.connectedTanks.push({
		tank: tank,
		side: side
	});
};

/*
	Update the snap area SVG's
*/
Pipe.prototype.updateSnapAreasSVG = function () {
	this.snapAreas.first.updateSVG();
	this.snapAreas.second.updateSVG();
};

/*
	Shows the snap area for the pipe. Used
	for debugging purposes.
*/
Pipe.prototype.showSnapAreas = function () {
	this.snapAreas.first.createSVG();
	this.snapAreas.second.createSVG();
};

/*
	Hides the snap area for the pipe. Used
	for debugging purposes.
*/
Pipe.prototype.hideSnapAreas = function () {
	this.snapAreas.first.destroySVG();
	this.snapAreas.second.destroySVG();
};
