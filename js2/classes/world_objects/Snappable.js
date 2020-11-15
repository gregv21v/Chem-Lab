/*
  On a very basic level, every object consists of it's basic core, and multiple
  traits that expand itlity.

  *Snappable* is an trait that indicates that a object can be snapped to.
    Includes: Pipes, Tanks, and Valves

  *Sidded* is an trait that indicates that an object has one or more entrences that
    liquid can be entered through.
      Includes: Pipes, and Tanks

*/
class Snappable extends GameObject {
  constructor(center) {
    super(center)

    this.center = center
    this.orientation = "horizontal"

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
    return 100
  };

  /**
    getShapeHeight()
    @description the height of the shape of the object irregadless of
      of what type of object it is
  */
  getHeight() {
    return 100;
  };

  getRect() {
  	var newRect = new Rect();
  	newRect.position = this.position
    rect.width = this.getWidth(); // horizontal dimension
    rect.height = this.getHeight(); //   vertical dimension
  	return newRect;
  };


  getTopArea() {
    var topArea = new Rect()
    topArea.fill.color = "red"
    topArea.width = this.getWidth()
    topArea.height = this.snapRadius
    topArea.position.x = this.center.x - this.getWidth() / 2
    topArea.position.y = this.center.y - this.getHeight() / 2 - this.snapRadius

    return topArea
  };

  getBottomArea() {
    var bottomArea = new Rect()
    bottomArea.fill.color = "green"
    bottomArea.width = this.getWidth()
    bottomArea.height = this.snapRadius
    bottomArea.position.x = this.center.x - this.getWidth() / 2
    bottomArea.position.y = this.center.y - this.getHeight() / 2 + this.snapRadius

    return bottomArea
  };


  getLeftArea() {
    var leftArea = new Rect()
    leftArea.fill.color = "blue"
    leftArea.width = this.snapRadius
    leftArea.height = this.getHeight()
    leftArea.position.x = this.center.x - this.getWidth() / 2 - this.snapRadius
    leftArea.position.y = this.center.y - this.getHeight() / 2

    return leftArea
  };


  getRightArea() {
    var rightArea = new Rect()
    rightArea.fill.color = "yellow"
    rightArea.width = this.snapRadius
    rightArea.height = this.getHeight()
    rightArea.position.x = this.center.x + this.getWidth() / 2
    rightArea.position.y = this.center.y - this.getHeight() / 2

    //console.log("Right Area: " + JSON.stringify(rightArea));

    return rightArea
  };

  getSnapAreas() {
    return {
      top: this.getTopArea(),
      bottom: this.getBottomArea(),
      left: this.getLeftArea(),
      right: this.getRightArea()
    }
  };

  showSnapAreas() {
    var snapAreas = this.getSnapAreas()
    for(var key of Object.keys(snapAreas)) {
      console.log(key);

      snapAreas[key].fill.opacity = 0.5
      snapAreas[key].createSVG()
    }
  };

  hideSnapAreas() {
    var snapAreas = this.getSnapAreas()
    for(var key of Object.keys(snapAreas)) {
      snapAreas[key].destroySVG()
    }
  };



  snapTo(snappable, mousePos) {
    var snapAreas = snappable.getSnapAreas()
    snappable.showSnapAreas();

    for(var snapArea of Object.keys(snapAreas)) {
      var thisRect = this.getRect()
      var otherRect = snappable.getRect()

      //thisRect.createSVG()

      // if this object intersects with the snap area of the
      // other object then match the edges of the two objects

      //console.log(snapAreas[snapArea]);
      if(thisRect.intersects(snapAreas[snapArea])) {
        console.log("found intersection");
        if(snapArea === "left") {
          // match this object with the left edge of
          // the other object
          this.snapCenter.x = snappable.center.x - otherRect.getWidth() / 2 - thisRect.getWidth() / 2
          this.snapCenter.y = mousePos.y
          return "left"
        } else if(snapArea === "right") {
          // match the right edge
          this.snapCenter.x = snappable.center.x - otherRect.getWidth() / 2 - thisRect.getWidth() / 2
          this.snapCenter.y = mousePos.y
          return "right"
        } else if(snapArea === "top") {
          this.snapCenter.y = snappable.center.y + snappable.getHeight() / 2 - this.getHeight() / 2
          this.snapCenter.x = mousePos.x
          return "top"
        } else if(snapArea === "bottom") {
          this.snapCenter.y = snappable.center.y - snappable.getHeight() / 2 + this.getHeight() / 2
          this.snapCenter.x = mousePos.x
          return "bottom"
        }
      }
    }
    return "";
  };

}
