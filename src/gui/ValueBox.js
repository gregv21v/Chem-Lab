/**
 * ValueBox - displays a value with a label
 */

import * as d3 from "d3"
import Drawable from "../Drawable";

export default class ValueBox extends Drawable {


	/**
	 * constructor()
	 * @description constructs the value box
	 * @param {Point} position the top left corner of the value box
	 * @param {Number} width the width of the value box
	 * @param {Number} height the height of the value box
	 */
	constructor(position, width, height) {
		super(position)
		this._width = width;
		this._height = height;
		this._label = "";
	  	this._value = 0;
	}


	/**
	 * create() 
	 * @description creates the graphics
	 */
	create(parent) {
		this._group = d3.create("svg:g")
	
		this._svg = {
			rect: this._group.append("rect"),
			label: this._group.append("text")
		};

		this._group.attr("name", "ValueBox")
		this._svg.rect.attr("name", "rect")
		this._svg.label.attr("name", "label")

		this.width = this._width;
		this.height = this._height;
		this.position = this._position

		parent.append(() => this._group.node())
	}

	
	/**
	 * update() 
	 * @description updates the graphics 
	 */
	update() {
		// background
		this._svg.rect.attr("x", this._position.x);
		this._svg.rect.attr("y", this._position.y);
		this._svg.rect.attr("width", this._width);
		this._svg.rect.attr("height", this._height);
		this._svg.rect.attr("class", "ValueBox");

		this._svg.label.attr("x", this._position.x + this._width/2 - ((this.label.length + ("" + this.value).length) * 6)/2);
		this._svg.label.attr("y", this._position.y + this._height/2 + 5);
	}


	/**
	 * destroy()
	 * @description destroys the svg for the button
	 */
	destroy() {
		this._svg.label.remove();
		this._svg.rect.remove();
		this._svg._group.remove();
	}

	destroySVG() {
		this._svg.label.remove();
		this._svg.rect.remove();
	}




	/**
	 * get width()
	 * @description gets the width of the value box
	 * @returns the width of the value box 
	 */
	get width() {
		return this._width;
	}

	/**
	 * set width()
	 * @description sets the width of the value box
	 * @param {Number} value the value to set the width to
	 */
	set width(value) {
		this._width = value;
	}

	/**
	 * get height()
	 * @description gets the height of the value box
	 * @returns the height of the value box 
	 */
	get height() {
		return this._height;
	}

	/**
	 * set height()
	 * @description sets the height of the value box
	 * @param {Number} value the value to set the height to
	 */
	set height(value) {
		this._height = value;
	}



	/**
	 * set label() 
	 * @description sets the label of the value box
	 * @param {String} value the value to set the label to
	 */
	set label(value) {
		this._label = value;
		this._svg.label.text(this.label + ": " + this.value);
	}

	/**
	 * get label()
	 * @description gets the label of the value box
	 * @returns the label of the value box 
	 */
	get label() {
		return this._label;
	}

	/**
	 * set value() 
	 * @description sets the value of the value box
	 * @param {String} value the value to set the value to
	 */
	set value(val) {
		this._value = val;
		this._svg.label.text(this.label + ": " + this._value);
	}



	/**
	 * set styling
	 * @description sets the styling of the button
	 * @param {Object} styling the styling of the object
	 * 
	 * attributes:
	 * 	color - the color of the button
	 *  opacity - the opacity of the button
	 *  strokeColor - the color of the stroke of the border of the button
	 *  strokeWidth - the width of the stroke of the border of the button
	 *  textColor - the color of the buttons label
	 *  textOpacity - the opacity of the buttons label
	 */
	set styling(value) {
		this._styling = value;
   
		if(value.hasOwnProperty("color"))
			this._svg.rect.style("fill", value.color);
  
		if(value.hasOwnProperty("opacity"))
			this._svg.rect.style("fill-opacity", value.opacity);
  
		if(value.hasOwnProperty("textColor")) {
			this._svg.label.style("fill", value.textColor);
		}
  
		if(value.hasOwnProperty("strokeColor"))
			this._svg.rect.style("stroke", value.strokeColor);
		  
		if(value.hasOwnProperty("strokeWidth"))
			this._svg.rect.style("stroke-width", value.strokeWidth);
		  
	}

	/**
	 * set position
	 * @description sets the position of the Button
	 * @param {Point} value the new position of the button
	 */
	set position(value) {
		this._position = value; 

		this._svg.rect.attr("x", this._position.x);
		this._svg.rect.attr("y", this._position.y);

		this._svg.label.attr("x", this._position.x + this._width/2 - ((this.label.length + ("" + this._value).length) * 6)/2);
		this._svg.label.attr("y", this._position.y + this._height/2 + 5);
	}


}
