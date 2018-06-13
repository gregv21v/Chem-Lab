/*
  GameObject: all other objects stem from this one.

  contains the generic interface for every object.
    createSVG --> creates the svg for the object
    destroySVG --> removes the svg for the object

    snapTo --> snaps one object to another

*/

function GameObject(center) {

  this.center = center

  /*********
    Visuals
  **********/
  this.svg = {} // TODO: set graphic attributes within this object
  // each object looks like this: { type: "", properties: {} }
  // then creating the object looks like this: svg.data(properties).enter().append(type)

  // Open sides that appear visually open
  this.openSides = {
    top: false,
    bottom: false,
    left: false,
    right: false
  }

  // snap parts
  this.snapCenter = {x: 0, y: 0}
  this.snapping = false;
}




GameObject.prototype.createSVG = function () {
  var svg = d3.select("body").select("svg")

	this.updateSVG();

	// add all the svg objects to the world
  for(var key in this.svg) {
      svg.data(this.svg[key].properties)
         .enter()
            append(this.svg[key].type)
  }
};

GameObject.prototype.updateSVG = function () {

};

GameObject.prototype.destroySVG = function () {

};
