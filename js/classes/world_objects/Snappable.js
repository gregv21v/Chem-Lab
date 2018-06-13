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
  this.center = center
  this.rect = new Rect() // the rectangle that represents the object
  this.snapAreas = {
    left: new Rect(),
    right: new Rect(),
    up: new Rect(),
    down: new Rect()
  }


  // snap parts
  this.snapCenter = {x: 0, y: 0}
  this.snapping = false;
}


// Rotating should maintain consistency
// between the snap areas and their corrisponding
// sides.
Snappable.prototype.rotate = function () {

};
