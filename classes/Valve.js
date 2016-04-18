/*
  Valve: controls the flow of liquids through the pipes.
*/


function Valve(center, width, interiorHeight, wallWidth) {
  this.width = width;
  this.opened = false;
  this.alignment = "horizontal";
  this.pipe = null; // the pipe that this valve is connected to.
  this.position = position;
  this.interiorHeight = interiorHeight;

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

	SVGMain.appendChild(this.svg.latch);
	SVGMain.appendChild(this.svg.walls);
  SVGMain.appendChild(this.svg.interior);
};

Valve.prototype.updateSVG = function() {
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

  // latch
  this.svg.latch.setAttribute("width", this.getWidth());
	this.svg.latch.setAttribute("height", this.getHeight());
	this.svg.latch.setAttribute("x", this.position.x);
	this.svg.latch.setAttribute("y", this.position.y);
	this.svg.latch.setAttribute("fill", "black");

	// interior
	this.svg.interior.setAttribute("fill", "white");

}
