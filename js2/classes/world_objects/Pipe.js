class Pipe extends Snappable {

  constructor(center, width, interiorHeight, wallWidth) {
    super(center)

    this.connectedTanks = [];
  	this.wallWidth = wallWidth;
  	this.interiorHeight = interiorHeight;
  	this.position = {x: 0, y: 0}
  	//this.center = center; // position of pipe
  	this.width = width;

  	this.currentLevel = 0;
  	this.drops = [];

  	var mainSVG = d3.select("body").select("svg")
  	this.svg = {
  		walls: mainSVG.append("rect"),
  		interior: mainSVG.append("rect")
  	}

  	this.position = {x: 0, y: 0};
  	this.rect = this.getRect();
  	this.updatePosition();

  }

  addDrop (drop, direction) {
  	this.drops.push({
  		drop: drop,
  		direction: direction
  	})
  };

  /*
  	Adds back a drop that was retrieved from
  	the spout.
  */
  addDropBack (drop) {
  	this.drops.push(drop);
  };

  /*
  	Here is where the liquid comes out of the Pipe
  	and can be collected by another tank or something else.
  */
  spout () {
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


  updateDrops () {
  	for(var x in this.drops) {
  		if(this.drops[x].drop.canFlow(this, this.drops[x].direction)) {
  			this.drops[x].drop.flow(this, this.drops[x].direction);
  		}
  	}
  };

  /*
  	=============Drawing the Pipe=============
  */
  createSVG() {
  	var SVGMain = document.getElementById("main");

  	this.updateSVG();

  };

  updateTooltip () {
    this.tooltip.position = this.position;
  	this.updatePosition();
  };

  updateSVG() {
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

  setOrientation (orientation) {
  	this.orientation = orientation;
  	this.updatePosition();
  };

  updatePosition() {
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




  /************************************************
  	Physical Properties
  ************************************************/
  getHeight() {
  	if(this.orientation === "horizontal") {
  		return this.interiorHeight + this.wallWidth * 2;
  	} else {
  		return this.width;
  	}
  };

  getWidth() {
  	if(this.orientation === "horizontal") {
  		return this.width;
  	} else {
  		return this.interiorHeight + this.wallWidth * 2;
  	}
  };

  getDropSize() {
  	return this.interiorHeight;
  };



  getName() {
  	return "Pipe";
  };

  getRect() {
  	this.updatePosition();
  	var newRect = new Rect();
  	newRect.position = this.position
    newRect.width = this.getWidth(); // horizontal dimension
    newRect.height = this.getHeight(); // vertical dimension

  	return newRect;
  };




  attachTo(tank, side) {
  	this.connectedTanks.push({
  		tank: tank,
  		side: side
  	});
  };

}
