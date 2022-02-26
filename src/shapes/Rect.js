/**
 * Rect - a rectangle whose position starts at the top left corner
 */

import * as d3 from "d3"

export default class Rect {
	/**
	 * constructor()
	 * @description constructs the Rect
	 * @param {Point} position the position of the Rect, top left corner
	 * @param {Number} width the width of the rect
	 * @param {Number} height the height of the rect
	 */
	constructor(position={x: 0, y: 0}, width=0, height=0) {
		this._width = width;
		this._height = height;
		this._position = position; // top left corner
		this._fill = {
			opacity: 0.5,
			color: "white"
		};
		this._stroke = {
			color: "blue",
			width: 1
		};

		
	}

	

	/**
	 * getCenter()
	 * @returns the center point of the rectangle
	 * @deprecated in favor of get center()
	 */
	getCenter() {
		return {
			x: this._position.x + this._width / 2,
			y: this._position.y + this._height / 2
		}
	}

	/**
	 * contains()
	 * @description checks whether the specifed point is contained within the rect
	 * @param {Point} point the point to check for 
	 * @returns true if the point is contained within the rect 
	 * 			false otherwise
	 */
	contains (point) {
		return (
				(this._position.x <= point.x
		 && this._position.x + this._width >= point.x)
		 && (this._position.y <= point.y
		 && this._position.y + this._height >= point.y)
	 );
	}

	/**
	 * intersects()
	 * @description checks whether this rectangle intersects with another
	 * @param {Rect} rect the rectangle to check intersection with
	 * @returns true if the two rects intersect
	 * 			false otherwise
	 */
	intersects(rect) {
		// if at least one corner of the rect is in the other rect
		return (
			// this.rect intersects rect
			this.contains({x: rect.position.x, y: rect.position.y}) || // top left
			this.contains({x: rect.position.x + rect.width, y: rect.position.y}) || // top right
			this.contains({x: rect.position.x, y: rect.position.y + rect.height}) || // bottom left
			this.contains({x: rect.position.x + rect.width, y: rect.position.y + rect.height}) || // bottom right
			// rect intersects this.rect
			rect.contains({x: this._position.x, y: this._position.y}) || // top left
			rect.contains({x: this._position.x + this._width, y: this._position.y}) || // top right
			rect.contains({x: this._position.x, y: this._position.y + this._height}) || // bottom left
			rect.contains({x: this._position.x + this._width, y: this._position.y + this._height}) // bottom right
		);
	}

	/**
	 * withinYRange()
	 * @description checks whether this rectangle is within the y range 
	 *  of another rectangle
	 * @param {Rect} rect the other rectangle
	 */
	withinYRange(rect) {
		return (
			(
				this._position.y < rect.position.y && 
				this._position.y + this._height > rect.position.y
			) || (
				this._position.y < rect.position.y + rect.height &&
				this._position.y + this._height > rect.position.y + rect.height
			)
		)
	}

	
	/**
	 * fromPoints()
	 * @description creates a rectangle from two points
	 * @param {Point} point1 the first point of the rectangle
	 * @param {Point} point2 the second point of the rectangle
	 */
	fromPoints (point1, point2) {
		if(point1.x < point2.x) {
			this._position.x = point1.x;
		} else {
			this._position.x = point2.x;
		}

		if(point1.y > point2.y) {
			this._position.y = point1.y;
		} else {
			this._position.y = point2.y;
		}

		this._width = Math.abs(point1.x - point2.x);
		this._height = Math.abs(point1.y - point2.y);
	};
	

	/**
	 * create()
	 * @param {SVG} parent the parent SVG to append this rect to
	 */
	create(parent) {
		this._group = d3.create("svg:g")

		this._svg = {
			rect: this._group.append("rect")
		}

		parent.append(() => this._group.node())
	}

	/**
	 * update()
	 * @description updates the attributes of the svg shape
	 */
	update() {
		this._svg.rect.attr("width", this._width);
		this._svg.rect.attr("height", this._height);
		this._svg.rect.attr("x", this._position.x);
		this._svg.rect.attr("y", this._position.y);
		this._svg.rect.attr("stroke-width", this._stroke.width);
		this._svg.rect.attr("stroke", this._stroke.color);
		this._svg.rect.attr("fill", this._fill.color);
		this._svg.rect.attr("fill-opacity", this._fill.opacity);
	}

	/**
	 * destroy()
	 * @description destroys the svg
	 */
	destroy() {
		this._group.remove()
	}

	

	/**
	 * set fill()
	 * @description sets the fill of the rectangle
	 * @param {Object} value the object to set the fill to. The object has a color, and opacity values
	 */
	 set fill(value) {
		this._fill = value;
	}

	/**
	 * get fill()
	 * @description gets the fill of this rect
	 */
	get fill() {
		return this._fill
	}

	/**
	 * set stroke()
	 * @description sets the stroke of the rectangle
	 * @param {Object} value the object to set the stoke to. The object has a color, and width values
	 */
	set stroke(value) {
		this._stroke = value;
	}

	/**
	 * get stroke()
	 * @description gets the stroke of this rect
	 */
	get stroke() {
		return this._stroke
	}

	/**
	 * get width()
	 * @returns the width of the rect
	 */
	get width() {
		return this._width;
	}

	/**
	 * set width()
	 * @description set the width
	 * @param {Number} value the value to set width to
	 */
	set width(value) {
		this._width = value;
	}

	/**
	 * get height()
	 * @returns the height of the rect
	 */
	get height() {
		return this._height;
	}

	/**
	 * set height()
	 * @description set the width
	 * @param {Number} value the value to set width to
	 */
	set height(value) {
		this._height = value;
	}

	/**
	 * get position()
	 * @returns the position of the rect
	 */
	get position() {
		return this._position;
	}

	/**
	 * set position()
	 * @description sets the position of the rect
	 */
	set position(value) {
		this._position = value;
	}

}
