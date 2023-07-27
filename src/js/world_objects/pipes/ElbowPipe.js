/**
 * ElbowPipe - a pipe with a bend in it
 */

import { Distance } from "../../shapes/Point"
import Rect from "../../shapes/Rect"
import * as d3 from "d3"
import Pipe from "./Pipe"

export default class ElbowPipe extends Pipe {
    /**
     * constructor() 
     * @description constructs the elbow pipe
     * @param {position} position the position of the elbow pipe
     * @param {Number} diameter the diameter of the elbow pipe
     * @param {Number} lengthFromCorner the length of the pipe starting from its corner
     * @param {Number} wallWidth the width of the walls of the pipe
     */
    constructor(layer, position, diameter, lengthFromCorner, wallWidth) {
        super(layer, position, diameter, lengthFromCorner, wallWidth)
  
        this.diameter = diameter
        this._length = lengthFromCorner
        this.wallWidth = wallWidth
        this.rotation = 0 // there are 4 rotations
        this.position = position
  
        this.drops = [];
    }



    /**
     * getSnapAreas()
     * @description gets the snap areas of the pipe
     * @returns the snap areas of the pipe
     */
    getSnapAreas() {
      if(this.rotation === 0) {
        return {
          left: this.getStartSnapArea(),
          down: this.getEndSnapArea()
        }
      } else if(this.rotation === 90) {
        return {
          left: this.getStartSnapArea(),
          up: this.getEndSnapArea()
        }
      } else if(this.rotation === 180) {
        return {
          right: this.getStartSnapArea(),
          up: this.getEndSnapArea()
        }
      } else if(this.rotation === 270) {
        return {
          right: this.getStartSnapArea(),
          down: this.getEndSnapArea()
        }
      }
    }




    /**
     * getStartSnapArea()
     * @description gets the snap area for the start of the pipe
     * @returns the snap area at the start of the pipe
     */
    getStartSnapArea() {
      var area = new Rect()
      area.fill.color = "blue"
      area.width = this.snapRadius
      area.height = this.diameter + this.wallWidth * 2 + 10
      area.position.x = this._position.x - this.snapRadius
      area.position.y = this._position.y - 5

      if(this.rotation === 0 || this.rotation === 90) {
        area.position.x = this._position.x - this.snapRadius
        area.position.y = this._position.y - 5
      } else {
        area.position.y = this._position.y - 5
        area.position.x = this._position.x + this._length * 2 + this.diameter + this.wallWidth*2
      }

      return area
    }

    /**
     * getEndSnapArea()
     * @description gets the snap area for the end of the pipe
     */
    getEndSnapArea() {
      var area = new Rect()
      area.fill.color = "orange"
      area.width = this.diameter + this.wallWidth * 2 + 10
      area.height = this.snapRadius

      if(this.rotation === 90 || this.rotation === 180) {
        area.position.y = this._position.y - this._length - this.snapRadius - this.wallWidth
        area.position.x = this._position.x + this._length - 5
      } else {
        area.position.y = this._position.y + this._length + this.diameter + this.wallWidth * 2
        area.position.x = this._position.x + this._length - 5
      }

      return area
    }

    /**
     * leftSnapBehaviour()
     * @description determines what happens when an Snappable snaps to
     *  the left of another snappable
     * @param snappable the Snappable being snapped to
     * @param mousePos the current position of the mouse
     */
    leftSnapBehaviour(snappable, mousePos) {
      var thisRect = this.rect
      //var otherRect = snappable.rect
      // match this object with the left edge of
      // the other object
      this.rotation = 0
      this.moveRelativeToCenter({
        x: snappable._center.x - thisRect.width / 2,
        y: mousePos.y
      })
    }

    /**
     * rightSnapBehaviour()
     * @description determines what happens when an Snappable snaps to
     *  the right of another snappable
     * @param snappable the Snappable being snapped to
     * @param mousePos the current position of the mouse
     */
    rightSnapBehaviour(snappable, mousePos) {
      var thisRect = this.rect
      var otherRect = snappable.rect

      this.rotation = 0
      // match the right edge
      this.moveRelativeToCenter({
        x: snappable._center.x + otherRect.width + thisRect.width / 2,
        y: mousePos.y
      })
    }

    /**
     * upSnapBehaviour()
     * @description determines what happens when an Snappable snaps to
     *  the top of another snappable
     * @param snappable the Snappable being snapped to
     * @param mousePos the current position of the mouse
     */
    upSnapBehaviour(snappable, mousePos) {
      var thisRect = this.rect
      var otherRect = snappable.rect

      this.rotation = 90
      this.moveRelativeToCenter({
        y: snappable._center.y - thisRect.height / 2,
        x: mousePos.x
      })
    }



    /**
     * downSnapBehaviour()
     * @description determines what happens when an Snappable snaps to
     *  the botttom of another snappable
     * @param snappable the Snappable being snapped to
     * @param mousePos the current position of the mouse
     */
    downSnapBehaviour(snappable, mousePos) {
      var thisRect = this.rect
      var otherRect = snappable.rect

      this.rotation = 90
      this.moveRelativeToCenter({
        y: snappable._center.y + otherRect.height + thisRect.height / 2,
        x: mousePos.x
      })
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
     * getDropStartPosition()
     * @description gets the start position of the drop in the pipe
     * @param {Side} side the side of the tank the pipe is on
     */
    getDropStartPosition(side, drop) {
      // position drop at front of pipe
      if(side === "left") {
        return {
          x: this._position.x + this.width - drop.size/2,
          y: this._center.y - drop.size/2
        }
      } else if(side === "right") {
        return {
          x: this._position.x,
          y: this._center.y
        }
      } else if(side === "up") {
        return {
          x: this._position.x + drop.size/2,
          y: this._position.y
        }
      } else if(side === "down") {
        return {
          x: this._position.x + this.width / 2 - drop.size/2,
          y: this._position.y
        }
      } else {
        console.warn("No Side Chosen for Drop Start")
      }
    }
  
  
    /**
      updateSVG()
      @description updates the attributes of the svg graphic
    */
    updateSVG() {
      //let xRotation = this.position.x + this._length / 2
      //let yRotation = this.position.y + this._length / 2
      //let transformStr = "rotate(" + this.rotation + "," + xRotation + "," + yRotation + ")"

      //this._group
        //.attr("transform", transformStr)

      let wallLength = this._length + this.diameter + this.wallWidth*2;
      let wallDiameter = this.diameter + this.wallWidth * 2

      let interiorLength = this._length + this.diameter + this.wallWidth

      this._svg.walls1
                .attr("x", this.position.x + ((this.rotation === 0 || this.rotation === 90) ? 0 : this._length))
                .attr("y", this.position.y)
                .attr("width", wallLength)
                .attr("height", wallDiameter)
                .style("fill", "black")
  
      this._svg.walls2
                .attr("x", this.position.x + this._length)
                .attr("y", this.position.y - ((this.rotation === 0 || this.rotation === 270) ? 0 : this._length + this.wallWidth))
                .attr("width", wallDiameter)
                .attr("height", wallLength)
                .style("fill", "black")
  
      this._svg.interior1
                .attr("x", this.position.x + ((this.rotation === 0 || this.rotation === 90) ? 0 : this._length + this.wallWidth))
                .attr("y", this.position.y + this.wallWidth)
                .attr("width", interiorLength)
                .attr("height", this.diameter)
                .style("fill", "white")
  
      this._svg.interior2
                .attr("x", this.position.x + this._length + this.wallWidth)
                .attr("y", this.position.y - ((this.rotation === 0 || this.rotation === 270) ? -this.wallWidth : this._length + this.wallWidth))
                .attr("width", this.diameter)
                .attr("height", interiorLength)
                .style("fill", "white")
    }

    /**
     * @description Rotates the snappable
     *  Rotating should maintain consistency
     *  between the snap areas and their corresponding
     *  sides.
     */
    rotate() {
      this.rotation = (this.rotation + 90) % 360;
    }


    /**
     * updateDrops()
     * @description update the drops in the elbow pipe
     */
    updateDrops() {
      // move the drops along the path of the pipe
      // move the drops to the first node 
      // once they encounter the first node, 
      // move to the next node 
      for(const x in this._drops) {
        // if can flow
        // move drop in its travelling direction
        // else if reached node 
        // turn 
        // else 
        // stop do nothing
        this._drops[x].flow();
        let path = this.getPath();
        let node = path[this._drops[x].stepAlongPath];
        let dist = Distance(node, this._drops[x].center)
        if(dist <= 3) {
          console.log("Turning");
          this._drops[x].turn(node.turn)
          this._drops[x].stepAlongPath += 1; 
        } else {
          this._drops[x].flow();
        }
      }
    }


    /**
     * getStartOpening()
     * @description gets the start opening of the pipe. This would be the 
     *  point at the top left corning of the start of the pipe
     * @returns {Point} the start opening of the pipe
     */
    getStartOpening() {
      if(this.rotation === 0 || this.rotation === 90) {
        return {
          ...this._position
        }
      } else {
        return {
          x: this._position.x + this._length * 2 + this.diameter + this.wallWidth*2,
          y: this._position.y 
        }
      }
    }

    /**
     * getStartOpening()
     * @description gets the start opening of the pipe. This would be the 
     *  point at the top left corning of the start of the pipe
     * @returns {Point} the start opening of the pipe
     */
    getEndOpening() {
      if(this.rotation === 90 || this.rotation === 180) {
        return {
          x: this._position.x + this._length,
          y: this._position.y - this._length - this.wallWidth
        }
      } else {
        return {
          x: this._position.x + this._length,
          y: this._position.y + this._length + this.diameter + this.wallWidth * 2
        }
      }
    }

    /**
     * getPath()
     * @description get the path that a fluid will follow through the pipe
     */
    getPath() {
      let path = [];
      if(this.rotation === 0) {
        path.push({
          x: this.position.x + this.diameter / 2,
          y: this.position.y + this._length,
          turn: "right"
        })
      } else {
        path.push({
          x: this.position.x + this._length,
          y: this.position.y +  this.diameter / 2,
          turn: "right"
        })
      }
      return path;
    }

    /**
     * get rect()
     * @description gets the rect for this pipe
     */
    get rect() {
      this._rect.position = this.position;
      this._rect.width = this.width
      this._rect.height = this.height
      return this._rect
    }
  
  
    /**
     * get width()
     * @description gets the width of the elbow pipe
     */
    get width() {
      return this._length + this.diameter + this.wallWidth * 2
    }
  
    /**
     * get height()
     * @description gets the height of the elbow pipe
     */
    get height() {
      return this._length + this.diameter + this.wallWidth * 2
    }
  
    /**
     * get name()
     * @description gets the name of the elbow pipe
     */
    get name() {
      return "Elbow Pipe"
    }
  
    
  }
  