/*
  On a very basic level, every object consists of it's basic core, and multiple
  traits that expand it's functionality.

  *Snappable* is an trait that indicates that a object can be snapped to.
    Includes: Pipes, Tanks, and Valves

  *Sidded* is an trait that indicates that an object has one or more entrences that
    liquid can be entered through.
      Includes: Pipes, and Tanks

*/
function Snappable(center)
{
  GameObject.call(this, center)

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
Snappable.prototype.rotate = function () {
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
Snappable.prototype.getWidth = function () {
  return 100
};

/**
  getShapeHeight()
  @description the height of the shape of the object irregadless of
    of what type of object it is
*/
Snappable.prototype.getHeight = function () {
  return 100;
};

Snappable.prototype.getRect = function () {
	var newRect = new Rect();
	newRect.position = this.position

	if(this.orientation === "horizontal") {
		rect.width = this.getHeight(); // horizontal dimension
		rect.height = this.getWidth(); // vertical dimension
	} else if(this.orientation === "vertical") {
		rect.width = this.getWidth(); // horizontal dimension
		rect.height = this.getHeight(); // vertical dimension
	}
	return newRect;
};


Snappable.prototype.getTopArea = function () {
  var topArea = new Rect()
  topArea.fill.color = "red"
  topArea.width = this.getWidth()
  topArea.height = this.snapRadius
  topArea.position.x = this.center.x - this.getWidth() / 2
  topArea.position.y = this.center.y - this.getHeight() / 2 - this.snapRadius

  return topArea
};

Snappable.prototype.getBottomArea = function () {
  var bottomArea = new Rect()
  bottomArea.fill.color = "green"
  bottomArea.width = this.getWidth()
  bottomArea.height = this.snapRadius
  bottomArea.position.x = this.center.x - this.getWidth() / 2
  bottomArea.position.y = this.center.y - this.getHeight() / 2 + this.snapRadius

  return bottomArea
};


Snappable.prototype.getLeftArea = function () {
  var leftArea = new Rect()
  leftArea.fill.color = "blue"
  leftArea.width = this.snapRadius
  leftArea.height = this.getHeight()
  leftArea.position.x = this.center.x - this.getWidth() / 2 - this.snapRadius
  leftArea.position.y = this.center.y - this.getHeight() / 2

  return leftArea
};


Snappable.prototype.getRightArea = function () {
  var rightArea = new Rect()
  rightArea.fill.color = "yellow"
  rightArea.width = this.snapRadius
  rightArea.height = this.getHeight()
  rightArea.position.x = this.center.x + this.getWidth() / 2
  rightArea.position.y = this.center.y - this.getHeight() / 2

  return rightArea
};

Snappable.prototype.getSnapAreas = function () {
  return {
    top: this.getTopArea(),
    bottom: this.getBottomArea(),
    left: this.getLeftArea(),
    right: this.getRightArea()
  }
};

Snappable.prototype.showSnapAreas = function () {
  var snapAreas = this.getSnapAreas()
  for(var key of Object.keys(snapAreas)) {
    console.log(key);

    snapAreas[key].fill.opacity = 0.5
    snapAreas[key].createSVG()
  }
};

Snappable.prototype.hideSnapAreas = function () {
  var snapAreas = this.getSnapAreas()
  for(var key of Object.keys(snapAreas)) {
    snapAreas[key].destroySVG()
  }
};



Snappable.prototype.snapTo = function (snappable, mousePos) {
  var snapAreas = snappable.getSnapAreas()
  for(var snapArea of Object.keys(snapAreas)) {

    // if this object intersects with the snap area of the
    // other object then match the edges of the two objects
    if(this.getRect().intersects(snapAreas[snapArea])) {
      if(snapArea === "left") {
        // match this object with the left edge of
        // the other object
        this.center.x = snappable.center.x - snappable.getWidth() / 2
        this.center.y = mousePos.y
        return "left"
      } else if(snapArea === "right") {
        // match the right edge
        this.center.x = snappable.center.x + snappable.getWidth() / 2
        this.center.y = mousePos.y
        return "right"
      } else if(snapArea === "top") {
        this.center.y = snappable.center.y - snappable.getHeight() / 2 - this.getHeight() / 2
        this.center.x = mousePos.x
        return "top"
      } else if(snapArea === "bottom") {
        this.center.y = snappable.center.y - snappable.getHeight() / 2 + this.getHeight() / 2
        this.center.x = mousePos.x
        return "bottom"
      }
    }
  }
  return "";
};
