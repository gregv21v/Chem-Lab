function Pipe(center, width, interiorHeight, wallWidth)
{
	this.wallWidth = wallWidth;
	this.interiorHeight = interiorHeight;
	this.center = center;
	this.width = width;
	this.svg = {
		interior: document.createElementNS("http://www.w3.org/2000/svg", "rect"),
		walls: document.createElementNS("http://www.w3.org/2000/svg", "rect")
	}
	this.alignment = "vertical";
	this.position = {x: 0, y: 0};
	this.rect = this.getRect();
	this.updatePosition();
	
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
		// walls
		this.svg.walls.setAttribute("width", this.getWidth());
		this.svg.walls.setAttribute("height", this.getHeight());

		// interior
		this.svg.interior.setAttribute("width", this.width);
		this.svg.interior.setAttribute("height", this.interiorHeight);
		this.svg.interior.setAttribute("x", this.position.x);
		this.svg.interior.setAttribute("y", this.position.y + this.wallWidth);
	} else {
		// walls
		this.svg.walls.setAttribute("width", this.getWidth());
		this.svg.walls.setAttribute("height", this.getHeight());

		// interior
		this.svg.interior.setAttribute("width", this.interiorHeight);
		this.svg.interior.setAttribute("height", this.width);
		this.svg.interior.setAttribute("x", this.position.x + this.wallWidth);
		this.svg.interior.setAttribute("y", this.position.y);
	}

	// walls 
	this.svg.walls.setAttribute("x", this.position.x);
	this.svg.walls.setAttribute("y", this.position.y);
	this.svg.walls.setAttribute("fill", "black");

	// interior
	this.svg.interior.setAttribute("fill", "blue");

}

Pipe.prototype.updatePosition = function() {
	if(this.alignment === "horizontal") {
		this.position.x = this.center.x - this.getWidth()/2;
		this.position.y = this.center.y - this.getHeight()/2;
	} else {
		this.position.x = this.center.x - this.getWidth()/2;
		this.position.y = this.center.y - this.getHeight()/2;
	}
}

/*
	Switch the pipe too and from horizontal and vertical alignment.
*/

Pipe.prototype.rotate = function() {
	if(this.alignment === "horizontal") {
		this.alignment = "vertical";
	} else {
		this.alignment = "horizontal";
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
	A string of info used for creating a tooltip
*/
Pipe.prototype.getInfo = function() {
	return "Interior Height: " + this.interiorHeight + ", Width: " + this.width;
};

Pipe.prototype.getRect = function() {
	return new Rect(
			{
				x: this.position.x - (this.interiorHeight + this.wallWidth * 2)/2,
				y: this.position.y - (this.interiorHeight + this.wallWidth * 2)/2
			},
			this.getWidth(),
			this.getHeight()
		);
};