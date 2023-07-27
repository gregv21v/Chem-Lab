import * as d3 from "d3"
import { rotatePoints } from "./Point";
import Shape from "./Shape";

export default class Fire extends Shape {

    /**
     * contructor()
     * @description constructs the fire
     * @param {Layer} layer the layer that the fire is drawn to
     * @param {Number} position the position of the fire
     * @param {Number} width the width of the fire
     * @param {Number} min the minimum height of the fire
     * @param {Number} max the maximum height of the fire
     * @param {Number} offset basically how much shared height the fire has 
     * @param {Number} flameCount the number of flames the fire has
     */
    constructor(layer, position, width, max, min, offset, flameCount) {
        super(layer, position);

        this._width = width;
        this._min = min;
        this._max = max;
        this._flameCount = flameCount;
        this._points = [];
        this._layer = layer; // the layer the fire is drawn to

        this._fill = {
            color: "orange",
            opacity: 1
        }

        this._stroke = {
            color: "red",
            width: 1,
            opacity: 0
        }

        let flameRadius = this._width / this._flameCount

        this._points.push({
            x: this._position.x,
            y: this._position.y + this._max + offset
        })

        for(let j = 1; j < this._flameCount; j++) {    
            this._points.push({
                x: this._position.x + j * flameRadius, 
                y: this._position.y + (((j % 2) === 0) ? this._max : this._min)
            })
        }

        this._points.push({
            x: this._position.x + this._width,
            y: this._position.y + this._max + offset
        })

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
        //this._center.x += deltaX;
        //this._center.y += deltaY;

		for (let i = 0; i < this._points.length; i++) {
			this._points[i].x += deltaX;
			this._points[i].y += deltaY;
		}
    }


    /**
     * moveTo()
     * @description moves the fire to point x, y
     * @param {Number} x the x position to move to
     * @param {Number} y the y position to move to
     */
    moveTo(x, y) {
        let center = this.center;
        for (const point of this._points) {
            let delta = {
                x: x - center.x,
                y: y - center.y
            }
            point.x += delta.x;
            point.y += delta.y;
        }
    }
    
    /**
     * scale() 
     * @description scales the fire
     * @param {Number} amount the scale amount
     */
    scale(amount) {
        this._points = this._points.map(point => {
			return {
				x: amount * (point.x - this.center.x) + this.center.x,
				y: amount * (point.y - this.center.y) + this.center.y,
			}
		})
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

}