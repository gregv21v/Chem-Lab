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
  var mainSVG = d3.select("body").select("svg")
  this.svg = {
    default: mainSVG.append("circle")
  }

  this.tooltip = new ToolTip(
    center,
    20, // radius of hover circle
    "");

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


GameObject.prototype.updateTooltip = function () {
  this.tooltip.position = this.position;
};




GameObject.prototype.createSVG = function () {
  var mainSVG = d3.select("body").select("svg")

  console.log(mainSVG);

	this.updateSVG();

	// add all the svg objects to the world
  var obj = mainSVG.append(this.svg.default.type)

  obj.attr("cx", this.position.x)
    .attr("cy", this.position.y)
    .attr("r", 5)
    .style("fill", "red")

};

GameObject.prototype.updateSVG = function () {

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
