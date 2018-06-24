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
  this.svg = {
    default: {
      type: "circle",
      properties: {
        radius: 20,
        fill: "blue",
        x: this.center.x,
        y: this.center.y
      }
    }
  } // TODO: set graphic attributes within this object
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
  var mainSVG = d3.select("body").select("svg")

  console.log(mainSVG);

	this.updateSVG();

	// add all the svg objects to the world
  var obj = mainSVG.append(this.svg.default.type)

  obj.attr("cx", this.svg.default.properties.x)
    .attr("cy", this.svg.default.properties.y)
    .attr("r", this.svg.default.properties.radius)
    .style("fill", this.svg.default.properties.fill)

};

GameObject.prototype.updateSVG = function () {

};

GameObject.prototype.destroySVG = function () {

};


GameObject.prototype.getLiquidType = function () {
  return "";
};

GameObject.prototype.getWidth = function () {
  return 0;
};

GameObject.prototype.getHeight = function () {
  return 0;
};

GameObject.prototype.getName = function () {
  return "";
};
