import { rotatePoints } from "../shapes/Point";
import Rect from "../shapes/Rect";
import Snappable from "./Snappable1";
import * as d3 from "d3";

/**
 * SnapPoint - the point to which two GameObjects can be snapped together
 * 
 * Make snap points rotateable 
 */
export default class SnapPoint extends Rect {
    
    /**
     * constructor()
     * @description constructs the SnapPoint
     * @param {Point} value the x or y value that the GameObject snaps to
     * @param {Area} area the snap area where snapping occurs
     * @param {String} axis the axis where snapping occurs. Can be x or y.
     */
    constructor(position, width, height, point, axis, side) {
        super(d3.select('[name="debug"]'), position, width, height)
        this._point = point; // the point being snapped to 
        this._axis = axis; // the fixed axis
        this._side = side; // the side being snapped to 
        this._attachments = []; // the attachments
    }


    /**
	 * rotateAroundPoint() 
	 * @description rotates the rectangle around a point
	 * @param {Point} point the point to rotate the rectangle around
	 * @param {Degrees} angle the angle to rotate the rectangle by in degrees
	 */
	rotateAroundPoint(center, angle) {
		var points = this.toPoints()
        var rotatedPoints = rotatePoints(points.concat(this._point), center, angle)
        this._point = rotatedPoints[rotatedPoints.length - 1]
		this.fromFourPoints(rotatedPoints.slice(0, -1));
	}

    
    /**
	 * rotateAroundCenter()
	 * @description rotates this rectangle around its center
	 */
	rotateAroundCenter(angle) {
		var cx = this.position.x + this.width / 2; // center x coordinate
		var cy = this.position.y + this.height / 2; // center y coordinate
		var points = this.toPoints().concat(this._point)
		var rotatedPoints = rotatePoints(points, {x: cx, y: cy}, angle);
        this._point = rotatedPoints[rotatedPoints.length - 1]
		this.fromFourPoints(rotatedPoints.slice(0, -1));
	}

    /**
     * moveBy() 
     * @description moves the snap point by a delta x, and y
     * @param {Number} deltaX the difference in x to move the snap point
     * @param {Number} deltaY the difference in y to move the snap point
     */
    moveBy(deltaX, deltaY) {
        this.position.x += deltaX;
        this.position.y += deltaY;

        this._point.x += deltaX
        this._point.y += deltaY

        
        /*if(this._debug) {
            this._debug
                .attr("cx", this._point.x)
                .attr("cy", this._point.y)
        } else {
            this._debug = d3.select('[name="debug"]')
                .append("circle")
                    .attr("cx", this._point.x)
                    .attr("cy", this._point.y)
                    .attr("r", 2)
                    .style("fill", "red")
        }*/
        
        
    }

    /**
     * attach()
     * @description attachs a snappable to this snap point
     * @param {Snappable} snappable the snappable to attach
     */
    attach(snappable) {
        this._attachments.push(snappable)
    }

    /**
     * get value()
     * @description gets the value of this snap point
     * @returns the value of this snap point
     */
    get point() {
        return this._point;
    }

    /**
     * set value()
     * @description sets the value of the snap point
     * @param {Number} value the x or y value of the snap point
     */
    set point(val) {
        this._point = val;
    }

    /**
     * get axis()
     * @description gets the axis of this snap point
     * @returns the axis of this snap point
     */
    get axis() {
        return this._axis;
    }

    /**
     * set axis()
     * @description sets the axis of this snap point
     * @param {String} value the new axis
     */
    set axis(value) {
        this._axis = value;
    }

    /**
     * get attachments()
     * @description gets the attachments attached to this snap point
     * @returns the attachments attached
     */
    get attachments() {
        return this._attachments;
    }

    /**
     * get side()
     * @description gets the side attached to this snap point
     * @returns the side
     */
    get side() {
        return this._side;
    }

    /**
     * set side()
     * @description sets the side attached to this snap point
     */
    set side(value) {
        this._side = value;
    }


    

    
}