// requires Point.js

function Circle(center, radius)
{
	this.radius = radius;
	this.center = center;
	this.color = "rgb(0, 0, 255)";
	this.fillOpacity = 0.5;
	this.svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
}


Circle.prototype.contains = function (point) {
  return Distance(this.center, point) <= this.radius;
};

Circle.prototype.createSVG = function() {
	var SVGMain = document.querySelector("svg");

	this.updateSVG();

	SVGMain.appendChild(this.svg);
};

Circle.prototype.destroySVG = function() {
	this.svg.remove();
};

Circle.prototype.updateSVG = function() {
	this.svg.setAttribute("r", this.radius);
	this.svg.setAttribute("cx", this.center.x);
	this.svg.setAttribute("cy", this.center.y);
	this.svg.setAttribute("fill", this.color);
	this.svg.setAttribute("fill-opacity", this.fillOpacity);
};
