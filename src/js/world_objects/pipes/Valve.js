/*
  Valve - controls the flow of liquids through the pipes.
*/

import Pipe from "./Pipe";

export default class Valve extends Pipe {
  /**
   * constructor()
   * @description constructs the valve
   * @param {Point} center the center of the valve
   * @param {Number} width the width of the valve
   * @param {Number} interiorHeight the interior height of the valve
   * @param {Number} wallWidth the width of the walls of the valve
   */
  constructor(center, width, interiorHeight, wallWidth) {
    super(center)

    this._width = width;
    this._opened = false;
    //this.pipe = null; // the pipe that this valve is connected to.
    this._position = center;

    this._interiorHeight = interiorHeight;
    this._wallWidth = wallWidth;

    this._description = [
      "Valves control the flow of fluids"
    ]
  }

  create() {
    this._svg = {
      // walls of the valve
      walls: this._group.append("rect"),
      // inner portion of the pipe.
      interior: this._group.append("rect"),
      // indicator if liquid can travel through the pipe.
      latch: this._group.append("rect"),
      // the rect to toggle the latch open and closed
      toggle: this._group.append("rect")
    }

    var self = this
    this._svg.toggle.on("mouseclick", function(event) {
      console.log("Toggling...");
      self.toggle();
      //self.updateSVG();
    })

  	this.updateSVG();
  }

  updateSVG() {
    var self = this;

    this._svg.toggle.attr("width", this.width);
    this._svg.toggle.attr("height", this.height);
    this._svg.toggle.attr("x", this.position.x);
    this._svg.toggle.attr("y", this.position.y);
    this._svg.toggle.style("fill-opacity", 0);
    this._svg.toggle.on("click", function() {
      self.toggle();
    });

  	if(this._rotation == 0) {
  		// interior
  		this._svg.interior.attr("width", this.width);
  		this._svg.interior.attr("height", this.interiorHeight);
  	} else {
  		// interior
  		this._svg.interior.attr("width", this.interiorHeight);
  		this._svg.interior.attr("height", this.width);
  	}

    this._svg.interior.attr("x", this.position.x);
    this._svg.interior.attr("y", this.position.y + this._wallWidth);
    this._svg.interior.style("fill-opacity", 0.5)


  	// walls
  	this._svg.walls.attr("width", this.width);
  	this._svg.walls.attr("height", this.height);
  	this._svg.walls.attr("x", this.position.x);
  	this._svg.walls.attr("y", this.position.y);
  	this._svg.walls.style("fill", "black").style("fill-opacity", 0.5);

    // latch
    this._svg.latch.attr("width", 10);
    this._svg.latch.attr("x", this.position.x + this.width/2 - 5);
    this._svg.latch.attr("y", this.position.y + this._wallWidth);
    this._svg.latch.style("fill", "black").style("fill-opacity", 1);

  	// interior
  	this._svg.interior.attr("fill", "white");

  }



  /**
   * toggle()
   * @description toggle the valve opened and closed
   */
  toggle() {
    if(this._opened) {
      this._opened = false;
      this._svg.latch.attr("height", this.interiorHeight);
    } else {
      this._opened = true;
      this._svg.latch.attr("height", 0);
    }
  };

  /**
   * get height() 
   * @description referes to height of the actual object in the world
   */
  get height() {
  	if(this._rotation === 0) {
  		return this._interiorHeight + this._wallWidth * 2;
  	} else {
  		return this._width;
  	}
  };

  /**
   * get width() 
   * @description referes to width of the actual object in the world
   */
  get width() {
  	if(this._rotation === 0) {
  		return this._width;
  	} else {
  		return this._interiorHeight + this._wallWidth * 2;
  	}
  };

  /**
   * get name()
   * @returns name of this Valve
   */
  get name() {
    return "Valve";
  }


  

}
