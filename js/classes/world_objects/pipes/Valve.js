/*
  Valve
  controls the flow of liquids through the pipes.


*/
class Valve extends Pipe {
  constructor(position, width, interiorHeight, wallWidth) {
    super(position, width, interiorHeight, wallWidth)

    this.width = width;
    this.opened = false;
    this.pipe = null; // the pipe that this valve is connected to.
    this.position = position;

    this.interiorHeight = interiorHeight;
    this.wallWidth = wallWidth;
  }

  createSVG() {
    var mainSVG = d3.select("body").select("svg")
    this.group = mainSVG.append("g")
    this.svg = {
      // walls of the valve
      walls: this.group.append("rect"),
      // inner portion of the pipe.
      interior: this.group.append("rect"),
      // indicator if liquid can travel through the pipe.
      latch: this.group.append("rect"),
      // the rect to toggle the latch open and closed
      toggle: this.group.append("rect")
    }

    var self = this
    this.svg.toggle.on("mouseclick", function(event) {
      console.log("Toggling...");
      self.toggle();
      //self.updateSVG();
    })

  	this.updateSVG();
  };

  updateSVG() {
    var self = this;

    this.svg.toggle
      .attr("width", this.getWidth())
      .attr("height", this.getHeight())
      .attr("x", this.position.x)
      .attr("y", this.position.y)
      .style("fill-opacity", 0)
      .on("click", function() {
        self.toggle()
      })

  	if(this.orientation === "horizontal") {
  		// interior
  		this.svg.interior.attr("width", this.width);
  		this.svg.interior.attr("height", this.interiorHeight);
  	} else {
  		// interior
  		this.svg.interior.attr("width", this.interiorHeight);
  		this.svg.interior.attr("height", this.width);
  	}

    this.svg.interior.attr("x", this.position.x);
    this.svg.interior.attr("y", this.position.y + this.wallWidth);
    this.svg.interior.style("fill-opacity", 0.5)

  	// walls
  	this.svg.walls.attr("width", this.getWidth());
  	this.svg.walls.attr("height", this.getHeight());
  	this.svg.walls.attr("x", this.position.x);
  	this.svg.walls.attr("y", this.position.y);
  	this.svg.walls.style("fill", "black").style("fill-opacity", 0.5);

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
  toggle() {
    if(this.opened) {
      this.opened = false;
      this.svg.latch.attr("height", 0);
    } else {
      this.opened = true;
      this.svg.latch.attr("height", this.interiorHeight);
    }
  };

  /**
    getHeight()
    @description referes to height of the actual object in the world
  */
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

}
