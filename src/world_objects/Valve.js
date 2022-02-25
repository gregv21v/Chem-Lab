/*
  Valve - controls the flow of liquids through the pipes.
*/

import Pipe from "./Pipe";
import * as d3 from "d3"

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

    this.width = width;
    this.opened = false;
    this.pipe = null; // the pipe that this valve is connected to.
    this.position = center;

    this.interiorHeight = interiorHeight;
    this.wallWidth = wallWidth;

    this.svg = {
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
    this.svg.toggle.on("mouseclick", function(event) {
      console.log("Toggling...");
      self.toggle();
      //self.updateSVG();
    })
  }

  createSVG() {
  	this.updateSVG();
  };

  updateSVG() {
    var self = this;

    this.svg.toggle.attr("width", this.getWidth());
    this.svg.toggle.attr("height", this.getHeight());
    this.svg.toggle.attr("x", this.position.x);
    this.svg.toggle.attr("y", this.position.y);
    this.svg.toggle.style("fill-opacity", 0);
    this.svg.toggle.on("click", function() {
      self.toggle();
    });

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

  /**
   * getName()
   * @returns name of this Valve
   */
  getName() {
    return "Valve";
  }

}
