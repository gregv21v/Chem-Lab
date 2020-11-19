class Pipe extends LiquidContainer {

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

  }

  addDrop(drop, side) {

    // set the drops start position
    if(side === "left") {
      drop.position = {
        x: this.position.x + this.getWidth() - drop.size/2,
        y: this.getCenter().y - drop.size/2
      }
    } else if(side === "right") {
      drop.position = {
        x: this.position.x,
        y: this.getCenter().y - drop.size/2
      }
    } else if(side === "up") {
      drop.position = {
        x: this.position.x + drop.size/2,
        y: this.position.y
      }
    } else if(side === "down") {
      drop.position = {
        x: this.position.x + drop.size/2,
        y: this.position.y
      }
    }

  	this.drops.push({
  		drop: drop,
  		direction: side
  	})

    drop.createSVG()
  };

  /*
  	Adds back a drop that was retrieved from
  	the spout.
  */
  addDropBack (drop) {
  	this.drops.push(drop);
  };

  /**
    spout()
    @description gets the drops available at the specified side
      of the pipe
  */
  spout(side) {
  	// search for available drops
  	var leakingDrops = []; // drops at their exit.
  	var keptDrops = [];
  	for(var drop of this.drops) {
  		// if a drop can no longer flow in the direction it was
  		// flowing, give it is at its spout, and ready to leak.
  		if(!drop.drop.canFlow(this, drop.direction) && drop.direction === side) {
  			leakingDrops.push(drop);
  		} else {
  			keptDrops.push(drop);
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
    for(var side of Object.keys(this.attachments)) {
			for(var object of this.attachments[side]) {
        var drops = this.spout(side);
        for(var drop of drops) {
          object.addDrop(drop.drop, side);
          
        }
      }
    }
  }


}
