class Pipe extends LiquidContainer {

  constructor(position, diameter, length, wallWidth) {
    super(position)
    
  	this.wallWidth = wallWidth;
  	this.diameter = diameter;
    this.length = length

  	this.currentLevel = 0;
  	this.drops = [];
  }




  addDrop(drop, side) {

    // set the drops start position
    if(side === "left") {
      drop.position = {
        x: this.position.x + this.getWidth() - drop.size/2,
        y: this.position.y + this.wallWidth
      }
    } else if(side === "right") {
      drop.position = {
        x: this.position.x,
        y: this.position.y + this.wallWidth
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

  /*
    Checks to see if a given pipe can access the
    liquid in the tank.
  */
  canAccessLiquid(tank) {
    // the opening of the pipe is even with the
    // tanks liquid or above it.
    var y = this.position.y + this.diameter - this.wallWidth; // y bottom interior wall of pipe.
    if(y > tank.getLiquidWorldY()) {
      return true;
    } else {
      return false;
    }

  };


  updateDrops () {
  	for(var x in this.drops) {
  		if(this.drops[x].drop.canFlow(this, this.drops[x].direction)) {
  			this.drops[x].drop.flow(this, this.drops[x].direction);
  		}
  	}
  }

  /*
  	=============Drawing the Pipe=============
  */
  createSVG() {
    var mainSVG = d3.select("body").select("svg")
    this.group = mainSVG.append("g")
  	this.svg = {
  		walls: this.group.append("rect"),
  		interior: this.group.append("rect")
  	}
  }


  getButtomEdgeY() {
    return this.position.y + this.diameter - this.wallWidth;
  }

  updateSVG() {
    let rotationX = this.getWidth() / 2
    let rotationY = this.getHeight() / 2
    let transformStr = "translate(" + this.position.x + "," + this.position.y + ") "
    transformStr += "rotate(" + this.rotation + "," + rotationX + "," + rotationY + ")"
    this.group.attr("transform", transformStr)

    // interior
    this.svg.interior
      .attr("width", this.length)
      .attr("height", this.diameter - this.wallWidth * 2)
      .attr("x", 0)
      .attr("y", this.wallWidth)
      .style("fill", "white")
  		.style("fill-opacity", 1)

    // walls
  	this.svg.walls
      .attr("width", this.length)
  	  .attr("height", this.diameter)
  	  .attr("x", 0)
  	  .attr("y", 0)
  	  .style("fill", "black")
  		.style("fill-opacity", 1)
  }







  /************************************************
  	Physical Properties
  ************************************************/
  getHeight() {
  	if(this.rotation === 90) {
  		return this.diameter;
  	} else {
  		return this.length;
  	}
  };

  getWidth() {
  	if(this.rotation === 90) {
  		return this.diameter;
  	} else {
  		return this.length;
  	}
  };

  getDropSize() {
  	return this.diameter - this.wallWidth * 2;
  };

  getSnapAreas() {
    if(this.rotation === 0) {
      return {
        left: this.getLeftArea(),
        right: this.getRightArea()
      }
    } else if(this.rotation === 90) {
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
