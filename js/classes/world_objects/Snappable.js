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

  // snap areas are the regions around a given game object
  // that will cause a another object to snap with this object
  /*
    Example Areas:

  */
  this.snapAreas = {
    left: new Rect(),
    right: new Rect(),
    top: new Rect(),
    bottom: new Rect()
  }


  // snap parts
  this.snapCenter = {x: 0, y: 0}
  this.snapping = false; // determines if the object is currently snapping
}


// Rotating should maintain consistency
// between the snap areas and their corresponding
// sides.
Snappable.prototype.rotate = function () {
   //Not Yet Implemented
};

/**
  Gets a rectangle representing this GameObject
*/
Snappable.prototype.getRect = function () {

};

Snappable.prototype.snapTo = function (snappable) {
  for(var snapArea of Object.keys(snappable.snapAreas)) {

    // if this object intersects with the snap area of the
    // other object then match the edges of the two objects
    if(this.getRect().intersect(snappable[snapArea])) {
      if(snapArea === "left") {
        // match this object with the left edge of
        // the other object
        this.center.x = this.snappable.center.x - this.snappable.getWidth() / 2

      } else if(snapArea === "right") {
        // match the right edge
        this.center.x = this.snappable.center.x + this.snappable.getWidth() / 2

      } else if(snapArea === "top") {
        this.center.y = this.snappable.center.y - this.snappable.getHeight() / 2

      } else if(snapArea === "bottom") {
        this.center.y = this.snappable.center.x + this.snappable.getHeight() / 2

      }
    }
  }
};

Snappable.prototype.matchEdges = function () {

};
