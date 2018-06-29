/*
  Valve
  controls the flow of liquids through the pipes.


*/


function Valve(center, width, interiorHeight, wallWidth) {

  GameObject.call(this, center)

  this.width = width;
  this.opened = false;
  this.alignment = "horizontal";
  this.pipe = null; // the pipe that this valve is connected to.
  this.position = center;

  this.snapCenter = {x: 0, y: 0}; // position of pipe when in the snapping region.
  this.snapping = false;

  this.interiorHeight = interiorHeight;
  this.wallWidth = wallWidth;

  var mainSVG = d3.select("body").select("svg")
  this.svg = {
    // indicator if liquid can travel through the pipe.
    latch: mainSVG.append("rect"),
    // walls of the valve
    walls: mainSVG.append("rect"),
    // inner portion of the pipe.
    interior: mainSVG.append("rect"),
    // the rect to toggle the latch open and closed
    toggle: mainSVG.append("rect")
  }

}

Valve.prototype = Object.create(GameObject.prototype);
Valve.prototype.constructor = Valve;


Valve.prototype.createSVG = function() {
	var SVGMain = document.getElementById("main");

	this.updateSVG();

};

Valve.prototype.updateSVG = function() {
	//this.updatePosition();
  var self = this;

  this.svg.toggle.attr("width", this.getWidth());
  this.svg.toggle.attr("height", this.getHeight());
  this.svg.toggle.attr("x", this.position.x);
  this.svg.toggle.attr("y", this.position.y);
  this.svg.toggle.style("fill-opacity", 0);
  this.svg.toggle.on("click", function() {
    self.toggle();
  });

	if(this.alignment === "horizontal") {
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
	this.svg.walls.style("fill", "black").style("fill-opacity", 1);

  // latch
  this.svg.latch.attr("width", 10);
  this.svg.latch.attr("x", this.position.x + this.width/2 - 5);
  this.svg.latch.attr("y", this.position.y + this.wallWidth);
  this.svg.latch.style("fill", "black").style("fill-opacity", 1);

	// interior
	this.svg.interior.attr("fill", "white");

}


Valve.prototype.toggle = function () {
  if(this.opened) {
    this.opened = false;
    this.svg.latch.attr("height", 0);
  } else {
    this.opened = true;
    this.svg.latch.attr("height", this.interiorHeight);
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
Valve.prototype.getName = function() {
	return "Valve";
};
