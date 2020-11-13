/*
  Valve
  controls the flow of liquids through the pipes.


*/


function Valve(center, width, interiorHeight, wallWidth) {

  Snappable.call(this, center)

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
    // walls of the valve
    walls: mainSVG.append("rect"),
    // inner portion of the pipe.
    interior: mainSVG.append("rect"),
    // indicator if liquid can travel through the pipe.
    latch: mainSVG.append("rect"),
    // the rect to toggle the latch open and closed
    toggle: mainSVG.append("rect")
  }

  var self = this
  this.svg.toggle.on("mouseclick", function(event) {
    console.log("Toggling...");
    self.toggle();
    //self.updateSVG();
  })

}

Valve.prototype = Object.create(Snappable.prototype);
Valve.prototype.constructor = Valve;


Valve.prototype.createSVG = function() {
	var SVGMain = document.getElementById("main");

	this.updateSVG();

};

Valve.prototype.updateSVG = function() {
	this.updatePosition();
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



/**
  toggle()
  @description toggle the valve opened and closed
*/
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

Valve.prototype.updatePosition = function() {
	if(!this.snapping) {
		this.position.x = this.center.x - this.getWidth()/2;
		this.position.y = this.center.y - this.getHeight()/2;
	} else {
		this.position.x = this.snapCenter.x - this.getWidth()/2;
		this.position.y = this.snapCenter.y - this.getHeight()/2;
	}
}

/**
  getRect()
  @description get a rectangle representing
    the area of the valve
*/
Valve.prototype.getRect = function () {
  this.updatePosition();
  var rect = new Rect()
  rect.position = this.position
  rect.width = this.getWidth();
  rect.height = this.getHeight();

  return rect;
};

/*
	Checks to see if this pipe snaps to a tank, and return
	the side the tank is on.

	Returns: side that the tank is on
*/
Valve.prototype.snapTo = function (tank) {
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

/*
	Info used for creating a tooltip
*/
Valve.prototype.getName = function() {
	return "Valve";
};
