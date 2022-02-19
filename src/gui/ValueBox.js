/**
 * ValueBox - displays a value
 */

import * as d3 from "d3"

export default class ValueBox {


	/**
	 * constructor()
	 * @description constructs the value box
	 * @param {Point} position the top left corner of the value box
	 * @param {Number} width the width of the value box
	 * @param {Number} height the height of the value box
	 */
	constructor(position, width, height) {
		this.position = position;
		this.width = width;
		this.height = height;
		this.label = "";
	  	this.value = 0;

		let svgMain = d3.select("body").select("svg");
		this.svg = {
			rect: svgMain.append("rect"),
			label: svgMain.append("text")
		};
	}

	createSVG() {

		// background
		this.svg.rect.attr("x", this.position.x);
		this.svg.rect.attr("y", this.position.y);
		this.svg.rect.attr("width", this.width);
		this.svg.rect.attr("height", this.height);
		this.svg.rect.attr("class", "ValueBox");

		this.svg.label.attr("x", this.position.x + this.width/2 - ((this.label.length + ("" + this.value).length) * 6)/2);
		this.svg.label.attr("y", this.position.y + this.height/2 + 5);
	};

	destroySVG() {
		this.svg.label.remove();
		this.svg.rect.remove();
	}

	setFill(fill) {
		if(fill.hasOwnProperty("color"))
			this.svg.rect.style("fill", fill.color);
		if(fill.hasOwnProperty("opacity"))
			this.svg.rect.style("fill-opacity", fill.opacity);
	};

	setTextFill(fill) {
		if(fill.hasOwnProperty("color"))
			this.svg.label.style("fill", fill.color);
		if(fill.hasOwnProperty("opacity"))
			this.svg.label.style("fill-opacity", fill.opacity);
	};


	setStroke(stroke) {
		if(stroke.hasOwnProperty("color"))
			this.svg.rect.style("stroke", stroke.color);
		if(stroke.hasOwnProperty("width"))
			this.svg.rect.style("stroke-width", stroke.width);
	};

	setLabel(label) {
	  this.label = label;
		this.svg.label.text(this.label + ": " + this.value);
	};

	setValue (value) {
	  this.value = value;
		this.svg.label.text(this.label + ": " + this.value);
	};

	updateText () {
		this.svg.label.text(this.label + ": " + this.value);
	};
}
