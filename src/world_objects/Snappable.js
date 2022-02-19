/*
  On a very basic level, every object consists of it's basic core, and multiple
  traits that expand itlity.

  *Snappable* is an trait that indicates that a object can be snapped to.
    Includes: Pipes, Tanks, and Valves

  *Sidded* is an trait that indicates that an object has one or more entrences that
    liquid can be entered through.
      Includes: Pipes, and Tanks

*/
import GameObject from "./GameObject"
import Rect from "../shapes/Rect"
import { Distance } from "../shapes/Point"

export default class Snappable extends GameObject {
  constructor(center) {
    super(center)

    this.position = {x: 0, y: 0}
    this.orientation = "horizontal"
    this.attachments = {}

    // snap areas are the regions around a given game object
    // that will cause a another object to snap with this object

    // snap parts
    this.snapCenter = {x: 0, y: 0}
    this.snapping = false; // determines if the object is currently snapping
    this.snapRadius = 20
  }


  // Rotating should maintain consistency
  // between the snap areas and their corresponding
  // sides.
  rotate() {
    if(this.orientation === "horizontal") {
      this.orientation = "vertical"
    } else if(this.orientation === "vertical"){
      this.orientation = "horizontal"
    }
  };

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

  /**
    getRect()
    @description get a rectangle representing
      the area of the valve
  */
  getRect() {
  	var newRect = new Rect();
  	newRect.position = this.position
    newRect.width = this.getWidth(); // horizontal dimension
    newRect.height = this.getHeight(); //   vertical dimension

    //newRect.createSVG()
  	return newRect;
  };

  /**
   * getUpArea()
   * @description gets the up area of the snappable
   * @returns the up area of the snappable
   */
  getUpArea() {
    var upArea = new Rect()
    upArea.fill.color = "red"
    upArea.width = this.getWidth()
    upArea.height = this.snapRadius
    upArea.position.x = this.position.x
    upArea.position.y = this.position.y - this.snapRadius

    return upArea
  };

  /**
   * getDownArea()
   * @description gets the down area of the snappable
   * @returns the snap area facing downwards
   */
  getDownArea() {
    var downArea = new Rect()
    downArea.fill.color = "green"
    downArea.width = this.getWidth()
    downArea.height = this.snapRadius
    downArea.position.x = this.position.x
    downArea.position.y = this.position.y + this.getHeight()

    return downArea
  };


  /**
   * getLeftArea()
   * @description gets the left area
   * @returns the left snap area 
   */
  getLeftArea() {
    var leftArea = new Rect()
    leftArea.fill.color = "blue"
    leftArea.width = this.snapRadius
    leftArea.height = this.getHeight()
    leftArea.position.x = this.position.x - this.snapRadius
    leftArea.position.y = this.position.y

    return leftArea
  };

  /**
   * getRightArea()
   * @description get the right snap area
   * @returns right snap area 
   */
  getRightArea() {
    var rightArea = new Rect()
    rightArea.fill.color = "yellow"
    rightArea.width = this.snapRadius
    rightArea.height = this.getHeight()
    rightArea.position.x = this.position.x + this.getWidth()
    rightArea.position.y = this.position.y

    //console.log("Right Area: " + JSON.stringify(rightArea));

    return rightArea
  };

  /**
   * getSnapAreas()
   * @description get the snap areas 
   * @returns the snap areas
   */
  getSnapAreas() {
    //this.updatePosition()
    return {
      up: this.getUpArea(),
      down: this.getBottomArea(),
      left: this.getLeftArea(),
      right: this.getRightArea()
    }
  };

  /**
    moveTo()
    @description moves to a given point, where the center of the Snappable is
      fixed at the given point
    @param point the point to center on
  */
  moveTo(point) {
    this.position.x = point.x
    this.position.y = point.y
  }

  /**
   * moveRelativeToCenter()
   * @description moves the Snappable relative to it's center
   * @param point point to move to
   */
  moveRelativeToCenter(point) {
    this.position.x = point.x - this.getWidth() / 2
    this.position.y = point.y - this.getHeight() / 2
  }


  /**
   * showSnapAreas()
   * @description shows the snap areas
   */
  showSnapAreas() {
    let snapAreas = this.getSnapAreas()
    for(const key of Object.keys(snapAreas)) {
      //console.log(key)
      snapAreas[key].fill.opacity = 0.5
      snapAreas[key].createSVG()
    }
  };

  /**
   * hideSnapArea()
   * @description hide the snap areas
   */
  hideSnapAreas() {
    let snapAreas = this.getSnapAreas()
    for(const key of Object.keys(snapAreas)) {
      snapAreas[key].destroySVG()
    }
  };

  /**
    leftSnapBehaviour()
    @description determines what happens when an Snappable snaps to
      the left of another snappable
    @param snappable the Snappable being snapped to
    @param mousePos the current position of the mouse
  */
  leftSnapBehaviour(snappable, mousePos) {
    var thisRect = this.getRect()
    var otherRect = snappable.getRect()
    // match this object with the left edge of
    // the other object
    this.orientation = "horizontal"
    this.moveRelativeToCenter({
        x: snappable.center.x - thisRect.width / 2,
        y: mousePos.y
    })
  }

  /**
    rightSnapBehaviour()
    @description determines what happens when an Snappable snaps to
      the right of another snappable
    @param snappable the Snappable being snapped to
    @param mousePos the current position of the mouse
  */
  rightSnapBehaviour(snappable, mousePos) {
    var thisRect = this.getRect()
    var otherRect = snappable.getRect()

    this.orientation = "horizontal"
    // match the right edge
    this.moveRelativeToCenter({
        x: snappable.center.x + otherRect.width + thisRect.width / 2,
        y: mousePos.y
    })
  }

  /**
    upSnapBehaviour()
    @description determines what happens when an Snappable snaps to
      the top of another snappable
    @param snappable the Snappable being snapped to
    @param mousePos the current position of the mouse
  */
  upSnapBehaviour(snappable, mousePos) {
    var thisRect = this.getRect()
    var otherRect = snappable.getRect()

    this.orientation = "vertical"
    this.moveRelativeToCenter({
      y: snappable.center.y - thisRect.height / 2,
      x: mousePos.x
    })
  }



  /**
    downSnapBehaviour()
    @description determines what happens when an Snappable snaps to
      the botttom of another snappable
    @param snappable the Snappable being snapped to
    @param mousePos the current position of the mouse
  */
  downSnapBehaviour(snappable, mousePos) {
    var thisRect = this.getRect()
    var otherRect = snappable.getRect()

    this.orientation = "vertical"
    this.moveRelativeToCenter({
      y: snappable.center.y + otherRect.height + thisRect.height / 2,
      x: mousePos.x
    })
  }

  /**
    findClosestSnapArea()
    @description find the closest snap area to the mouse position
    @param mousePos position of mouse
  */
  findClosestSnapArea(snappable, mousePos) {
    // find the closest snappable region that
    // intersects

    var closestSide = "";
    var closestDistance = 2000;
    var snapAreas = snappable.getSnapAreas()
    //snappable.showSnapAreas();
    var thisRect = this.getRect()
    var otherRect = snappable.getRect()

    for(var side of Object.keys(snapAreas)) {
      var distance = Distance(snapAreas[side].getCenter(), mousePos)
      // find the closest intersecting snap area
      if(distance < closestDistance && thisRect.intersects(snapAreas[side])) {
        closestDistance = distance
        closestSide = side
        this.snapping = true;
      }
    }

    return closestSide;
  }


  snapTo(snappable, mousePos) {

    let closestSide = this.findClosestSnapArea(snappable, mousePos);

    if(closestSide === "left") {
      this.leftSnapBehaviour(snappable, mousePos)
    } else if(closestSide === "right") {
      this.rightSnapBehaviour(snappable, mousePos)
    } else if(closestSide === "up") {
      this.upSnapBehaviour(snappable, mousePos)
    } else if(closestSide === "down") {
      this.downSnapBehaviour(snappable, mousePos)
    }

    return closestSide;
  };

  /**
    attachTo()
    @description attaches to snappables together on a particular side
    @param side the side to attach to
    @param snappable the snappable to attach this one to

  */
  attachTo(snappable, side) {
  	if(this.attachments[side] === undefined) {
      this.attachments[side] = [snappable]
      //console.log(this.attachments);
    } else {
      this.attachments[side].push(snappable)
    }
  };

}
