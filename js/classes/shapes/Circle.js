// requires Point.js

function Circle(center, radius)
{
	this.radius = radius;
	this.center = center;
	this.color = "rgb(0, 0, 255)";
	this.fillOpacity = 0.5;

	var mainSVG = d3.select("body").select("svg");
	this.svg = mainSVG.append("circle");
}


Circle.prototype.contains = function (point) {
  return Distance(this.center, point) <= this.radius;
};

Circle.prototype.createSVG = function() {
	this.svg.attr("r", this.radius);
	this.svg.attr("cx", this.center.x);
	this.svg.attr("cy", this.center.y);
	this.svg.attr("fill", this.color);
	this.svg.attr("fill-opacity", this.fillOpacity);
};

Circle.prototype.destroySVG = function() {
	this.svg.attr("r", 0);
};

Circle.prototype.updateSVG = function() {

};
