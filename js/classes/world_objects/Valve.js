/*
  Valve: controls the flow of liquids through the pipes.


*/


function Valve(center, width, interiorHeight, wallWidth) {
  this.width = width;
  this.opened = false;
  this.alignment = "horizontal";
  this.pipe = null; // the pipe that this valve is connected to.
  this.position = center;

  this.snapCenter = {x: 0, y: 0}; // position of pipe when in the snapping region.
  this.snapping = false;

  this.interiorHeight = interiorHeight;
  this.wallWidth = wallWidth;

  this.svg = {
    // indicator if liquid can travel through the pipe.
    latch: document.createElementNS("http://www.w3.org/2000/svg", "rect"),
    // walls of the valve
    walls: document.createElementNS("http://www.w3.org/2000/svg", "rect"),
    // inner portion of the pipe.
    interior: document.createElementNS("http://www.w3.org/2000/svg", "rect"),
    // the rect to toggle the latch open and closed
    toggle: document.createElementNS("http://www.w3.org/2000/svg", "rect")
  }

}




Valve.prototype.createSVG = function() {
	var SVGMain = document.getElementById("main");

	this.updateSVG();


	SVGMain.appendChild(this.svg.walls);
  SVGMain.appendChild(this.svg.interior);
  SVGMain.appendChild(this.svg.latch);
  SVGMain.appendChild(this.svg.toggle);
};

Valve.prototype.updateSVG = function() {
	//this.updatePosition();
  var self = this;

  this.svg.toggle.setAttribute("width", this.getWidth());
  this.svg.toggle.setAttribute("height", this.getHeight());
  this.svg.toggle.setAttribute("x", this.position.x);
  this.svg.toggle.setAttribute("y", this.position.y);
  this.svg.toggle.setAttribute("fill-opacity", 0);
  this.svg.toggle.addEventListener("click", function() {
    self.toggle();
  });

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

  // latch
  this.svg.latch.setAttribute("width", 10);
  this.svg.latch.setAttribute("x", this.position.x + this.width/2 - 5);
  this.svg.latch.setAttribute("y", this.position.y + this.wallWidth);
  this.svg.latch.setAttribute("fill", "black");

	// interior
	this.svg.interior.setAttribute("fill", "white");

}


Valve.prototype.toggle = function () {
  if(this.opened) {
    this.opened = false;
    this.svg.latch.setAttribute("height", 0);
  } else {
    this.opened = true;
    this.svg.latch.setAttribute("height", this.interiorHeight);
  }
};

Valve.prototype.getHeight = function() {
	if(this.alignment === "horizontal") {
		return this.interiorHeight + this.wallWidth * 2;
	} else {
		return this.width;
	}
};

Valve.prototype.getWidth = function() {
	if(this.alignment === "horizontal") {
		return this.width;
	} else {
		return this.interiorHeight + this.wallWidth * 2;
	}
};


Valve.prototype.getRect = function () {
  var rect = new Rect()
  rect.width = this.getWidth();
  rect.height = this.getHeight();

  return rect;
};

/*
	Info used for creating a tooltip
*/
Valve.prototype.getInfo = function() {
	return "Valve => Interior Height: " + this.interiorHeight + ", Width: " + this.width;
};
