/*
	Drop: the smallest unit of liquid


  Behavior: falls until it reaches the bottom of a tank. At that point,
	it enters the tank.
*/

 var lastId = 0;

class Drop {

  constructor(position, size, liquid) {
  	this.position = position;
  	this.size = size;
    this.liquid = liquid;
  	this.id = lastId;
    var mainSVG = d3.select("body").select("svg")
  	this.svg = mainSVG.append("rect");
    this.direction = "" // the direction that the drop is traveling in

    this.tooltip = new ToolTip(
      position,
      "Drop is the most basic unit of liquid");



  	lastId += 1;
  }

  /*
  	Creates and adds the svg to the main svg object.
  */
  createSVG() {
  	this.updateSVG();
  };

  /*
  	Updates the svg after its already been added to the main svg object.
  */
  updateSVG() {
  	this.svg.attr("width", this.size);
  	this.svg.attr("height", this.size);
  	this.svg.attr("x", this.position.x);
  	this.svg.attr("y", this.position.y);
  	this.svg.attr("fill", this.liquid.fill());
  };

  getVolume() {
    return this.size * this.size;
  };


  /*
    Removes the svg
  */
  destroySVG() {
  	this.svg.remove();
  }


  /*
    Causes a drop to fall until it enters a tank, or exits the world
  */
  fall(world) {
  	var self = this;

  	var svg = document.querySelector("svg");

  	this.position.y += 1;
  	this.updateSVG();

    // drop is outside the world
  	if(!world.within({position: this.position, width: this.size, height: this.size}))
  	{
  		world.removeDrop(this);
  		this.destroySVG();
  	}
  	else // drop is inside the world
  	{
  		// if in tank, remove drop and fill tank with size of drop
  		world.objs.forEach(function(obj) {

  			if(obj instanceof Tank && obj.containsDrop(self))
  			{
          // add respective amount of fluid to the tank
  				obj.addDrop(self);
  				obj.updateLiquidSVG();

  				// remove drop from world
  				world.removeDrop(self);
  				self.destroySVG();

  				return;
  			}
  		})
  	}
  };



  /*
    Causes the drop to flow through a pipe.
    This called every update.
    directions: up, down, left, right
  */
  flow(pipe) {
    if(this.direction === "up") {
      this.position.y -= 1
    }
    if(this.direction === "down") {
      this.position.y += 1
    }
    
    if(this.direction === "left") {
      this.position.x -= 1
    }
    
    if(this.direction === "right") {
      this.position.x += 1
    }
    this.updateSVG();
  };


  /*
    Checks to see if the drops can flow.

    Behavior: drops flow down and to the right.
  */
  canFlow(pipe) {
    if(this.direction === "up") {
      // make sure the drop is below the pipes upper edge
      if(this.position.y - 1 < pipe.getCenter().y - pipe.getHeight()/2 - this.size) {
        return false;
      }
    }
    if(this.direction === "down") {
      // make sure the drop is below the pipes lower edge
      if(this.position.y + 1 > pipe.getCenter().y + pipe.getHeight()/2 - this.size) {
        return false;
      }
    } else if(this.direction === "left") {
      // make sure the drop is below the pipes left edge
      if(this.position.x - 1 < pipe.getCenter().x - pipe.getWidth()/2) {
        return false;
      }
    }
    else if(this.direction === "right") {
      // make sure the drop is below the pipes right edge
      if(this.position.x + 1 > pipe.getCenter().x + pipe.getWidth()/2 - this.size) {
        return false;
      }
    }
    return true;
  };


}
