/*
  GameObject: all other objects stem from this one.

  contains the generic interface for every object.
    createSVG --> creates the svg for the object
    destroySVG --> removes the svg for the object

    snapTo --> snaps one object to another

*/
class GameObject {
  constructor(position) {
    this.position = position
    this.rotation = 0
  }

  createSVG() {
    /*********
      Visuals
    **********/
    var mainSVG = d3.select("body").select("svg")
    this.group = mainSVG.append("g")
    this.svg = {
      default: this.group.append("circle")
    }
  }

  updateSVG() {
    obj
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 5)
      .style("fill", "red")
  }

  /**
    rotate()
    @description rotates the GameObject 90 degrees
  */
  rotate() {
    this.rotation = (this.rotation + 90) % 360
    this.updateSVG()
  }


  /**
    getShapeHeight()
    @description the width of the shape of the object irregadless of
      of what type of object it is
  */
  getWidth() {
    return -1;
  };

  /**
    getShapeHeight()
    @description the height of the shape of the object irregadless of
      of what type of object it is
  */
  getHeight() {
    return -1;
  };

  getName() {
    return "";
  }

  /**
    getCenter()
    @description get the center point of this Snappable
  */
  getCenter() {
    return {
      x: this.position.x + this.getWidth() / 2,
      y: this.position.y + this.getHeight() / 2
    }
  }

  /**
    moveTo()
    @description moves to a given point, where the center of the Snappable is
      fixed at the given point
    @param point the point to center on
  */
  moveTo(point) {
    this.position.x = point.x
    this.position.y = point.y

    this.updateSVG()
  }

  /**
   * moveRelativeToCenter()
   * @description moves the Snappable relative to it's center
   * @param point point to move to
   */
  moveRelativeToCenter(point) {
    this.position.x = point.x - this.getWidth() / 2
    this.position.y = point.y - this.getHeight() / 2

    this.updateSVG()
  }

  /**
    getRect()
    @description get a rectangle representing
      the area of the GameObject
  */
  getRect() {
    var newRect = new Rect();
    newRect.position = this.position
    newRect.width = this.getWidth(); // horizontal dimension
    newRect.height = this.getHeight(); //   vertical dimension

    //newRect.createSVG()
    return newRect;
  };


}
