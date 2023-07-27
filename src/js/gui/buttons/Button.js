/*
	Button - A button
*/
import Drawable from "../../Drawable";
import * as d3 from "d3"

export default class Button extends Drawable {
	/**
	 * constructor()
	 * @description constructs the Button
	 * @param {Point} position the position of the button
	 * @param {Number} width the width of the button
	 * @param {Number} height the height of the button
	 */
	constructor(layer, position, width, height) {
		super(layer, position)
		this._width = width;
		this._height = height;
		this._text = "";
	}


	/**
	 * create() 
	 * @description creates the graphics and attach it to the parent
	 */
	create(parent) {
		this._group = d3.create("svg:g")
		this._layer.append(() => this._group.node())
		let self = this;
	
		this._svg = {
			rect: this._group.append("rect"),
			innerRect: this._group.append("rect"),
			label: this._group.append("text"),
			clickBox: this._group.append("rect")
		};

		this._group.attr("name", "Button")
		this._svg.rect.attr("name", "rect")
		this._svg.innerRect.attr("name", "innerRect")
		this._svg.label.attr("name", "label")
		this._svg.clickBox.attr("name", "clickBox")

		this._svg.clickBox.style("fill-opacity", 0)
		this._svg.clickBox.on("click", () => self.onClick())

		// initialize the attributes of the Button
		this.width = this._width;
		this.height = this._height;
		this.position = this._position;
		this.text = this._text;

		this.styling = {
			color: "blue", 
			opacity: 0.5,
			strokeColor: "black",
			strokeWidth: 10,
			textColor: "black",
			textOpacity: 1
		}

			
	}

	/**
	 * onClick()
	 * @description the function called when this button is clicked
	 */
	onClick() {
		// do nothing
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

		if(value.hasOwnProperty("fillOpacity"))
			this._svg.rect.style("fill-opacity", value.opacity);

		if(value.hasOwnProperty("textColor"))
			this._svg.label.style("fill", value.textColor);

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

		this._svg.clickBox.attr("x", this._position.x);
		this._svg.clickBox.attr("y", this._position.y);

		this._svg.rect.attr("x", this._position.x);
		this._svg.rect.attr("y", this._position.y);

		this._svg.label.attr("x", this._position.x + this.width/2 - (this.text.length * 6)/2);
		this._svg.label.attr("y", this._position.y + this.height/2 + 5);
	}


	/**
	 * get width()
	 * @description gets the width of the button
	 * @returns the width of the button 
	 */
	get width() {
		return this._width;
	}

	/**
	 * set width()
	 * @description sets the width of the button
	 * @param {Number} value the value to set the width to
	 */
	set width(value) {
		this._width = value;

		this._svg.clickBox.attr("width", this._width);
		this._svg.rect.attr("width", this._width);
	}

	/**
	 * get height()
	 * @description gets the height of the button
	 * @returns the height of the button 
	 */
	get height() {
		return this._height;
	}

	/**
	 * set height()
	 * @description sets the height of the button
	 * @param {Number} value the value to set the height to
	 */
	set height(value) {
		this._height = value;

		this._svg.clickBox.attr("height", this._height);
		this._svg.rect.attr("height", this._height);
	}

	/**
	 * get text()
	 * @description gets the text of the button
	 * @returns the text of the button 
	 */
	get text() {
		return this._text;
	}

	/**
	 * set text()
	 * @description sets the text of the button
	 * @param {String} value the value to set the text to
	 */
	set text(value) {
		this._text = value;

		this._svg.label.text(value);
	}

}
