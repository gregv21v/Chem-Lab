/**
 * ElbowPipe - a pipe with a bend in it
 */

import Pipe from "./Pipe"
import * as d3 from "d3"

export default class ElbowPipe extends Pipe {
    /**
     * constructor() 
     * @description constructs the elbow pipe
     * @param {position} position the position of the elbow pipe
     * @param {Number} diameter the diameter of the elbow pipe
     * @param {Number} lengthFromCorner the length of the pipe starting from its corner
     * @param {Number} wallWidth the width of the walls of the pipe
     */
    constructor(position, diameter, lengthFromCorner, wallWidth) {
        super(position, diameter, lengthFromCorner, wallWidth)
  
        this.diameter = diameter
        this._length = lengthFromCorner
        this.wallWidth = wallWidth
        this.rotation = 0 // there are 4 rotations
        this.position = position
  
        this.drops = [];
    }
  
  
    /**
      createSVG()
      @description creates the svg graphic
    */
    createSVG() {
        var mainSVG = d3.select("body").select("svg")
    
        this._group = mainSVG.append("g")
        this._svg = {
            walls1: this._group.append("rect"),
            walls2: this._group.append("rect"),
            interior1: this._group.append("rect"),
            interior2: this._group.append("rect")
        }
    }
  
  
    /**
      updateSVG()
      @description updates the attributes of the svg graphic
    */
    updateSVG() {
      let xRotation = this.position.x + this._length / 2
      let yRotation = this.position.y + this._length / 2
      let transformStr = "rotate(" + this.rotation + "," + xRotation + "," + yRotation + ")"

      this._group
        .attr("transform", transformStr)

      this._svg.walls1
                .attr("x", this.position.x)
                .attr("y", this.position.y)
                .attr("width", this._length)
                .attr("height", this.diameter + this.wallWidth * 2)
                .style("fill", "black")
  
      this._svg.walls2
                .attr("x", this.position.x + this._length)
                .attr("y", this.position.y)
                .attr("width", this.diameter + this.wallWidth * 2)
                .attr("height", this._length + this.diameter + this.wallWidth*2)
                .style("fill", "black")
  
      this._svg.interior1
                .attr("x", this.position.x)
                .attr("y", this.position.y + this.wallWidth)
                .attr("width", this._length + this.wallWidth)
                .attr("height", this.diameter)
                .style("fill", "white")
  
      this._svg.interior2
                .attr("x", this.position.x + this._length + this.wallWidth)
                .attr("y", this.position.y + this.wallWidth)
                .attr("width", this.diameter)
                .attr("height", this._length + this.diameter + this.wallWidth)
                .style("fill", "white")
    }

    /**
     * @description Rotates the snappable
     *  Rotating should maintain consistency
     *  between the snap areas and their corresponding
     *  sides.
     */
    rotate() {
      this.rotation += 90;
    };

    /**
     * getPath()
     * @description get the path that a fluid will follow through the pipe
     */
    getPath() {
      let path = [];
      if(this.orientation === "vertical") {
        path.push({
          x: this.position.x + this.diameter / 2, 
          y: this.position.y
        })
        path.push({
          x: this.position.x + this.diameter / 2,
          y: this.position.y + this._length
        })
      } else {
        path.push({
          x: this.position.x, 
          y: this.position.y + this.diameter / 2
        })
        path.push({
          x: this.position.x + this._length,
          y: this.position.y +  this.diameter / 2
        })
      }
      return path;
    }
  
  
    /**
     * get width()
     * @description gets the width of the elbow pipe
     */
    get width() {
      return this._length + this.diameter + this.wallWidth
    }
  
    /**
     * get height()
     * @description gets the height of the elbow pipe
     */
    get height() {
      return this._length + this.diameter + this.wallWidth
    }
  
    /**
     * get name()
     * @description gets the name of the elbow pipe
     */
    get name() {
      return "Elbow Pipe"
    }
  
    /**
     * updateDrops()
     * @description update the drops in the elbow pipe
     */
    updateDrops() {
        for(var x in this.drops) {
            if(this.drops[x].drop.canFlow(this, this.drops[x].direction)) {
                this.drops[x].drop.flow(this, this.drops[x].direction);
            }
        }
    }
  }
  