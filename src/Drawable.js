/**
 * Drawable - anything that can be drawn to the screen 
 */
import * as d3 from "d3"

export default class Drawable {
    /**
     * constructor()
     * @description constructs the Drawable
     * @param {Point} position the location of the drawable on the canvas
     */
    constructor(position) {
        // an object containing all the styling that describe the graphics
        // of the Drawable, such as fill stroke, color, etc...
        this._styling = {};  
        this._position = position; // the location of the drawable on the canvas
    }


	/**
	 * addElement() 
	 * @description adds an svg element to the drawable
	 * @param 
	 */

    

    /**
	 * create() 
	 * @description creates the svg graphics
	 */
	create(parent) {
        // each create function should start with an object that contains 
        // a list of svg that make up the graphic.
        // all those graphics should be attached to a group
        /* 
        Example:
		this._svg = {
			border: this._group.append("rect"),
			innerRect: this._group.append("rect"),
			label: this._group.append("text"),
			clickBox: this._group.append("rect")
		};
        */
       this._group = d3.create("svg:g")
       this._svg = {};

	   parent.append(() => this._group.node());
	}

    /**
	 * update() 
	 * @description removes the svg objects from the canvas 
	 */
	destroy() {
        this._group.remove();
	}


	/**
	 * set styling
	 * @description sets the styling of the button
	 * @param {Object} value the styling of the Drawable
	 * 
	 * Example Attributes:
	 * 	color - the color of the button
	 *  opacity - the opacity of the button
	 *  strokeColor - the color of the stroke of the border of the button
	 *  strokeWidth - the width of the stroke of the border of the button
	 *  textColor - the color of the buttons label
	 *  textOpacity - the opacity of the buttons label
	 */
	set styling(value) {
		this._styling = value;		
	}
}