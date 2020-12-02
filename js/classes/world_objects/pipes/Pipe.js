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
    let center = this.getWorldCenter();

    if(side === "left") {
      drop.position = {
        x: center.x + this.length / 2 - drop.size/2,
        y: center.y - this.wallWidth
      }
    } else if(side === "right") {
      drop.position = {
        x: center.x - this.length / 2,
        y: center.y - this.wallWidth
      }
    } else if(side === "up") {
      drop.position = {
        x: center.x + drop.size/2,
        y: center.y
      }
    } else if(side === "down") {
      drop.position = {
        x: center.x + drop.size/2,
        y: center.y
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
        console.log("drop leaking");
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
    var y = this.getWorldCenter().y + this.diameter/2 - this.wallWidth; // y bottom interior wall of pipe.

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

  getButtomEdgeY() {
    return this.position.y + this.diameter - this.wallWidth;
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

    //this.posSvg = new Circle(this.position, 10)
  //  this.posSvg.position = this.position
    //this.posSvg.createSVG()
    //this.posSvg.updateSVG()

  }



  updateSVG() {
    //this.posSvg.position = this.position
    //this.posSvg.updateSVG()

    // these coordinates are relative to
    // the group for which they are in
    let rotationX = this.diameter / 2
    let rotationY = this.length / 2

    let transformStr = "translate(" + this.position.x + "," + this.position.y + ") "
    transformStr += "rotate(" + this.rotation + "," + rotationX + "," + rotationY + ") "
    this.group.attr("transform", transformStr)

    // interior
    this.svg.interior
      .attr("width", this.diameter - this.wallWidth * 2)
      .attr("height", this.length)
      .attr("x", this.wallWidth)
      .attr("y", 0)
      .style("fill", "white")
  		.style("fill-opacity", 1)

    // walls
  	this.svg.walls
      .attr("width", this.diameter)
  	  .attr("height", this.length)
  	  .attr("x", 0)
  	  .attr("y", 0)
  	  .style("fill", "black")
  		.style("fill-opacity", 1)
  }





  /************************************************
    Properties
  ************************************************/
  /***
    getHeight
    @description the height of the object in the world
  */
  getHeight() {
    if(this.rotation === 0 || this.rotation === 180) {
      return this.length
    } else {
      return this.diameter
    }
  };

  /***
    getWidth()
    @description the width of the object in the world
  */
  getWidth() {
    if(this.rotation === 0 || this.rotation === 180) {
      return this.diameter
    } else {
      return this.length
    }
  };

  /**
    getWorldCenter()
    @description get the center point of this Snappable
  */
  getWorldCenter() {
    let center = {}

    if(this.rotation === 0 || this.rotation === 180) {
      center = {
        x: this.position.x + this.getWidth() / 2,
        y: this.position.y + this.getHeight() / 2,
      }
    } else {
      center = {
        x: this.position.x + this.getHeight() / 2,
        y: this.position.y + this.getWidth() / 2,
      }
    }

    return center;
  }

  /**
   * moveRelativeToCenter()
   * @description moves the Snappable relative to it's center
   * @param point point to move to
   */
  moveRelativeToCenter(point) {
    if(this.rotation === 0 || this.rotation === 180) {
      this.position = {
        x: point.x - this.diameter /2,
        y: point.y - this.length / 2
      }
    } else {
      this.position = {
        x: point.x - this.diameter /2,
        y: point.y - this.length / 2
      }
    }

    this.updateSVG()
  }

  getDropSize() {
  	return this.diameter - this.wallWidth * 2;
  };

  getSnapAreas() {
    //console.log(this.rotation);
    if(this.rotation === 0 || this.rotation === 180) {
      return {
        left: this.getLeftArea(),
        right: this.getRightArea()
      }
    } else {
      return {
        up: this.getTopArea(),
        down: this.getBottomArea()
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
