/*
	Pipe: a conduet for moving liquid
	from one tank to another.

*/

function Pipe(center, width, interiorHeight, wallWidth)
{
	this.wallWidth = wallWidth;
	this.interiorHeight = interiorHeight;
	this.center = center; // position of pipe
	this.snapCenter = {x: 0, y: 0}; // position of pipe when in the snapping region.
	this.snapping = false;
	this.width = width;
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

}
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
	this.svg.interior.setAttribute("fill", "blue");

}

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


/*
	Info used for creating a tooltip
*/
Pipe.prototype.getInfo = function() {
	return "Interior Height: " + this.interiorHeight + ", Width: " + this.width;
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
