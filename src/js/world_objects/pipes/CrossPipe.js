/**
 * ElbowPipe - a pipe with a bend in it
 */

import Pipe from "./Pipe"
import * as d3 from "d3"

export default class CrossPipe extends Pipe {
    /**
     * constructor() 
     * @description constructs the elbow pipe
     * @param {position} position the position of the pipe
     * @param {Number} diameter the diameter of the pipe
     * @param {Number} size the size of the pipe
     * @param {Number} wallWidth the width of the walls of the pipe
     */
    constructor(layer, position, diameter, size, wallWidth) {
        super(layer, position, diameter, wallWidth)
  
        this._diameter = diameter
        this._size = size
        this._wallWidth = wallWidth
        this._rotation = 0 // there are 4 rotations
        this._position = position
  
        this._drops = [];
        this._description = [
          "Pipe that is shaped like a cross"
        ]
    }
  
  
    /**
      createSVG()
      @description creates the svg graphic
    */
    create() {  
        this._group = this._layer.append("g")
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
      let xRotation = this._position.x + this._size / 2
      let yRotation = this._position.y + this._height / 2
      let transformStr = "rotate(" + this._rotation + "," + xRotation + "," + yRotation + ")"

      this._group
        .attr("transform", transformStr)

      this._svg.walls1
                .attr("x", this._position.x)
                .attr("y", this._position.y + this._size / 2 - (this._diameter / 2 + this._wallWidth))
                .attr("width", this._size)
                .attr("height", this._diameter + this._wallWidth * 2)
                .style("fill", "black")
  
      this._svg.walls2
                .attr("x", this._position.x + this._size / 2 - (this._diameter / 2 + this._wallWidth))
                .attr("y", this._position.y)
                .attr("width", this._diameter + this._wallWidth * 2)
                .attr("height", this._size)
                .style("fill", "black")
  
      this._svg.interior1
                .attr("x", this._position.x)
                .attr("y", this._position.y + this._size / 2 - this._diameter / 2) 
                .attr("width", this._size)
                .attr("height", this._diameter)
                .style("fill", "white")
  
      this._svg.interior2
                .attr("x", this._position.x + this._size / 2 - this._diameter / 2)
                .attr("y", this._position.y)
                .attr("width", this._diameter)
                .attr("height", this._size)
                .style("fill", "white")
    }

    /**
     * @description Rotates the snappable
     *  Rotating should maintain consistency
     *  between the snap areas and their corresponding
     *  sides.
     */
    rotate() {
      this._rotation += 90;
    };

    /**
     * getPath()
     * @description get the path that a fluid will follow through the pipe
     */
    getPath() {
      let path = [];
      path.push({
        x: this._position.x + this._diameter / 2, 
        y: this._position.y
      })
      path.push({
        x: this._position.x + this._diameter / 2,
        y: this._position.y + this._length
      })
      return path;
    }
  
  
    /**
     * get width()
     * @description gets the width of the elbow pipe
     */
    get width() {
      return this._size;
    }
  
    /**
     * get height()
     * @description gets the height of the elbow pipe
     */
    get height() {
      return this._size;
    }
  
    /**
     * get name()
     * @description gets the name of the elbow pipe
     */
    get name() {
      return "Cross Pipe"
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
  