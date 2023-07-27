import * as d3 from "d3"
import { rotatePoints } from "./Point";

export default class Arrow {

    /**
     * contructor()
     * @description constructs the arrow
     * @param {Layer} layer the layer that the arrow is drawn to
     * @param {Number} radius the radius of the arrow
     * @param {Number} center the center of the arrow
     */
    constructor(layer, radius, center) {
        this._radius = radius;
        this._center = center;
        this._points = [];
        this._layer = layer; // the layer the arrow is drawn to

        this._fill = {
            color: "red",
            opacity: 1
        }

        this._stroke = {
            color: "red",
            width: 1,
            opacity: 0
        }

        let angle = 360 / 3

		for (let i = 0; i < 3; i++) {
			this._points.push({
				x: this._center.x + this._radius * Math.cos((i * angle) * Math.PI / 180), 
				y: this._center.y + this._radius * Math.sin((i * angle) * Math.PI / 180)
            })
		}
    }


    create() {
        this._svg = this._layer.append("path")

        this.update();
    }


    /**
     * update() 
     * @description updates the arrow
     */
    update() {
        let path = d3.path() 

		path.moveTo(
			this._points[0].x, 
			this._points[0].y
		)

		for (let i = 0; i < this._points.length; i++) {
			path.lineTo(
				this._points[i].x, 
			    this._points[i].y
			)
		}

        path.closePath();

		this._svg
			.attr("d", path)
			.style("stroke", this._stroke.color)
			.style("fill", this._fill.color)
            .style("stroke-width", this._stroke.width)
            .style("stroke-opacity", this._stroke.opacity)
            .style("fill-opacity", this._fill.opacity)
    }


    /**
	 * toPoints()
	 * @description converts this rectangle to points
	 * @returns the points that make up this rectangle
	 */
	toPoints() {
        return this._points;
	}


    /**
	 * rotateAroundPoint() 
	 * @description rotates the arrow around a point
	 * @param {Point} point the point to rotate the arrow around
	 * @param {Degrees} angle the angle to rotate the arrow by in degrees
	 */
	rotateAroundPoint(center, angle) {
		var points = this.toPoints()
		this._points = rotatePoints(points, center, angle);
	}

    /**
	 * rotate() 
	 * @description rotates the arrow around itself
	 * @param {Point} point the point to rotate the arrow around
	 * @param {Degrees} angle the angle to rotate the arrow by in degrees
	 */
	rotate(angle) {
		var points = this.toPoints()
		this._points = rotatePoints(points, this._center, angle);
	}

    /**
     * moveBy() 
     * @description moves the arrow by a delta x, and y
     * @param {Number} deltaX the difference in x to move the arrow
     * @param {Number} deltaY the difference in y to move the arrow
     */
    moveBy(deltaX, deltaY) {
        this._center.x += deltaX;
        this._center.y += deltaY;

		for (let i = 0; i < 3; i++) {
			this._points[i].x += deltaX;
			this._points[i].y += deltaY;
		}
    }


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
     * @description gets the center
     * @returns the center
     */
    get center() {
        return this._center;
    }
}