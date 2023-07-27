/**
 * Shape - the basic graphical unit of the game 
 */

export default class Shape {


    /**
     * constructor()
     * @description constructs the shape
     * @param {SVGElement} layer the layer that the shape is attached to
     */
    constructor(layer, position) {
        this._layer = layer;
        this._position = position;

        this._fill = {
            color: "rgb(0, 0, 255)",
            opacity: 1
        }

        this._stroke = {
            color: "red",
            width: 1,
            opacity: 0
        }
    }


    /**
     * create()
     * @description creates the shape
     */
    create() {}


    /**
     * update()
     * @description updates the shape
     */
    update() {}

    /**
     * destroy()
     * @description destroys the shape
     */
    destroy() {}


    /**
     * clone()
     * @description makes a copy of the shape
     */
    clone() {}


    /**
     * toPoints()
     * @description converts the shape to points
     */
    toPoints() {}


    /**
     * containsPoint()
     * @description check if the shape contains a point
     */
    contains() {}


    /**
     * updateStyles() 
     * @description updates the styles of the svg
     */
    updateStyles() {
        this._svg
            .attr("stroke-width", this._stroke.width)
		    .attr("stroke", this._stroke.color)
		    .attr("stroke-opacity", this._stroke.opacity)
		    .attr("fill", this._fill.color)
		    .attr("fill-opacity", this._fill.opacity)
    }


    /**
     * moveBy()
     * @description moves the shape by delta
     * @param {Number} deltaX the difference in x 
     * @param {Number} deltaY the difference in y 
     */
    moveBy(deltaX, deltaY) {
        this._position.x += deltaX
        this._position.y += deltaY
    }

	/**
	 * moveTo()
	 * @description moves to a specific position
	 * @param {Number} x the x value of the position
	 * @param {Number} y the y value of the position
	 */
	moveTo(x, y) {
		this._position.x = x;
		this._position.y = y;
	}


    /**
	 * scale()
	 * @description scales the rectangle by the given amount
	 * @param {Number} amount the amount to scale the rectangle by
	 */
	scale(amount) {}


	/**
	 * scaleHeight()
	 * @description scales the y dimension of all objects in the group
	 * @param {Number} amount the amount to scale the y dimension by
	 */
	scaleY(amount) {}

	/**
	 * scaleWidth()
	 * @description scales the x dimension of all objects in the group
	 * @param {Number} amount the amount to scale the x dimension by
	 */
	scaleX(amount) {}

    /**
	 * set fill()
	 * @description sets the fill of the arrow
	 * @param {Object} value the object to set the fill to. The object has a color, and opacity values
	 */
	set fill(value) {
		this._fill = value;
	}

	/**
	 * get fill()
	 * @description gets the fill of this arrow
	 */
	get fill() {
		return this._fill
	}

	/**
	 * set stroke()
	 * @description sets the stroke of the arrow
	 * @param {Object} value the object to set the stoke to. The object has a color, and width values
	 */
	set stroke(value) {
		this._stroke = value;
	}

	/**
	 * get stroke()
	 * @description gets the stroke of this arrow
	 */
	get stroke() {
		return this._stroke
	}


    /**
     * get center()
     * @description gets the center of the shape
     */
    get center() {
        let points = this.toPoints();
        let total = {
            x: 0,
            y: 0
        }

        for (const point of points) {
            total.x += point.x 
            total.y += point.y 
        }

        return {
            x: total.x / points.length,
            y: total.y / points.length
        }
    }

    /**
	 * get position()
	 * @returns the position of the shape
	 */
	get position() {
		return this._position;
	}

	/**
	 * set position()
	 * @description sets the position of the shape
	 */
	set position(value) {
		this._position = value;
	}

	/**
	 * get x()
	 * @description gets the x position of the shape
	 * @returns the x position of the shape
	 */
	get x() {
		return this._position.x;
	}

	/**
	 * set x()
	 * @description sets the x position of the shape
	 * @param {Number} value the value to set x position
	 */
	set x(value) {
		this._position.x = value;
	}


	/**
	 * get x()
	 * @description gets the x position of the shape
	 * @returns the x position of the shape
	 */
	get y() {
		return this._position.y;
	}

	/**
	 * set y()
	 * @description sets the y position of the shape
	 * @param {Number} value the value to set y position
	 */
	set y(value) {
		this._position.y = value;
	}


	/**
	 * get layer() 
	 * @description gets the layer of the shape
	 * @returns {Layer} the layer that the shape is attached to
	 */
	set layer(value) {
		this._layer = value;
	}
}