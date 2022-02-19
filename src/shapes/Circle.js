/**
 * Circle - a circle
 */
import * as d3 from "d3"
import { Distance } from "./Point";

export default class Circle {

	/**
	 * constructor()
	 * @param {Point} center the center of the circle
	 * @param {Number} radius the radius of the circle
	 */
	constructor(center, radius) {
		this.radius = radius;
		this.center = center;
		this.color = "rgb(0, 0, 255)";
		this.fillOpacity = 0.5;

		var mainSVG = d3.select("body").select("svg");
		this.svg = mainSVG.append("circle");
	}

	contains (point) {
	  return Distance(this.center, point) <= this.radius;
	}

	createSVG() {
		this.svg.attr("r", this.radius);
		this.svg.attr("cx", this.center.x);
		this.svg.attr("cy", this.center.y);
		this.svg.attr("fill", this.color);
		this.svg.attr("fill-opacity", this.fillOpacity);
	}

	destroySVG() {
		this.svg.attr("r", 0);
	}

	updateSVG() {

	}

}
