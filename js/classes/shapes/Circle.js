// requires Point.js
class Circle {
	constructor(center, radius) {
		this.radius = radius;
		this.center = center;
		this.color = "rgb(0, 0, 255)";
		this.fillOpacity = 0.5;


	}

	contains (point) {
	  return Distance(this.center, point) <= this.radius;
	};

	createSVG() {
		var mainSVG = d3.select("body").select("svg");
		this.svg = mainSVG.append("circle");
	};

	destroySVG() {
		this.svg.attr("r", 0);
	};

	updateSVG() {
		this.svg.attr("r", this.radius);
		this.svg.attr("cx", this.center.x);
		this.svg.attr("cy", this.center.y);
		this.svg.attr("fill", this.color);
		this.svg.attr("fill-opacity", this.fillOpacity);
	};

}
