class Pipe extends Snappable {

  constructor(center, width, interiorHeight, wallWidth) {
    super(center)

  	this.wallWidth = wallWidth;
  	this.interiorHeight = interiorHeight;
  	this.position = center
  	//this.center = center; // position of pipe
  	this.width = width;

  	this.currentLevel = 0;
  	this.drops = [];

  	var mainSVG = d3.select("body").select("svg")
  	this.svg = {
  		walls: mainSVG.append("rect"),
  		interior: mainSVG.append("rect")
  	}

  	//this.rect = this.getRect();
  	//this.updatePosition();

  }

  /**
   * @description adds a drop to the pipe
   * @param {Drop} drop the drop to add
   */
  addDrop (drop) {
  	this.drops.push(drop)
  };

  /**
  	takeExitingDrops()
  	@description takes the exiting drops from the pipe
  */
  takeExitingDrops(side) {
  	// search for available drops
  	var exitingDrops = []; // drops at their exit.
  	var keptDrops = []; // drops that are not about to exit
  	for(const drop of this.drops) {
		//debugger
		console.log(drop);
  		// if a drop can no longer flow in the direction it was
  		// flowing, give it is at its spout, and ready to leak.
  		if(!drop.canFlow(this) && side === drop.direction) {
  			exitingDrops.push(drop);
  		} else {
  			keptDrops.push(drop);
  		}
  	}
  	this.drops = keptDrops;
  	return exitingDrops;
  };


  updateDrops () {
  	for(var x in this.drops) {
  		if(this.drops[x].canFlow(this)) {
  			this.drops[x].flow(this);
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
  	//this.updatePosition();
  };

  updateSVG() {
  	//this.updatePosition();

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
  	//this.updatePosition();
  };


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

  getSnapAreas() {
    if(this.orientation === "horizontal") {
      return {
        left: this.getLeftArea(),
        right: this.getRightArea()
      }
    } else if(this.orientation === "vertical") {
      return {
        top: this.getTopArea(),
        bottom: this.getBottomArea()
      }
    }

  }


  getName() {
  	return "Pipe";
  };

  /**
    transferLiquid()
    @description transfers liquid to connected tanks
  */
  transferLiquid() {
    for(const side of Object.keys(this.attachments)) {
		for(const tank of this.attachments[side]) { // for each tank attached to this pipe
			if(tank instanceof Tank) {
				let exitingDrops = this.takeExitingDrops(side); // take the exiting drops
				for(var drop of exitingDrops) {
					tank.addDrop(drop);
					drop.destroySVG()
					tank.updateLiquidSVG()
				}
        }
      }
    }
  }


}
