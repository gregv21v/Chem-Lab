/**
 * Circle - a circle
 * 
 */
import * as d3 from "d3"
import { Distance } from "./Point";
import Shape from "./Shape";

export default class Circle extends Shape {

	/**
	 * constructor()
	 * @param {Point} center the center of the circle
	 * @param {Number} radius the radius of the circle
	 */
	constructor(layer, center, radius) {
		super(layer);
		this._radius = radius;
		this._position = center;		
	}


	/**
	 * create()
	 * @description creates the graphic
	 */
	create() {
		this._svg = this._layer.append("circle");

		this.update();
	}

	update() {
		this._svg
			.attr("r", this._radius)
			.attr("cx", this.center.x)
		 	.attr("cy", this.center.y)

		this.updateStyles();
	}

	/**
	 * toPoints()
	 * @description converts the circle to points
	 */
	toPoints() {
		let sides = 6;
		let angle = 360 / sides
		let points = [];

		for (let i = 0; i < sides; i++) {
			points.push({
				x: this.center.x + this._radius * Math.cos((i * angle) * Math.PI / 180), 
				y: this.center.y + this._radius * Math.sin((i * angle) * Math.PI / 180)
            })
		}

		return points;
	}

	contains (point) {
	  return Distance(this.center, point) <= this._radius;
	}

	/**
	 * set center()
	 * @description sets the center of the circle
	 * @param {Number} center the center of the circle
	 */
	set center(value) {
		this._position = value;
	}

	/**
	 * get center() 
	 * @description gets the center of the circle
	 * @return {Point} the center of the circle
	 */
	get center() {
		return this._position;
	}


}
