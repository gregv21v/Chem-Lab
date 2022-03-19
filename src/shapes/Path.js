import Snap from "snapsvg-cjs";

/**
 * Path - a path
 * 
 * 
 * Command	            Name	            Parameters
 *  M	    moveto	                        (x y)+
 *  Z	    closepath	                    (none)
 *  L	    lineto	                        (x y)+
 *  H	    horizontal lineto	             x+
 *  V	    vertical lineto	                 y+
 *  C	    curveto	                        (x1 y1 x2 y2 x y)+
 *  S	    smooth curveto	                (x2 y2 x y)+
 *  Q	    quadratic Bézier curveto	    (x1 y1 x y)+
 *  T	    smooth quadratic Bézier curveto	(x y)+
 *  A	    elliptical arc	                (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
 *  R	    Catmull-Rom curveto*	        x1 y1 (x y)+
 */
export default class Path {
    
    /**
     * constructor()
     * @description constructs the path object
     */
    constructor() {
        this._commands = [];
    }



    /**
     * toString()
     * @description converts this path to a string
     */
    toString() {
        let str = ""
        for (const command of this._commands) {
            str += " " + command
        }
        return str;
    }


    /**
     * moveTo()
     * @description moves the path pointer to point x, y
     * @param {Number} x the x coordiante to move to
     * @param {Number} y the y coordiante to move to 
     */
    moveTo(x, y) {
        this._commands.push("M" + x + "," + y)
    }


    /**
     * closePath()
     * @description closes the path
     */
    closePath() {
        this._commands.push("Z")
    }


    /**
     * lineTo()
     * @description draws a line between the current location of the path 
     *  pointer and (x, y)
     * @param {Number} x the x coordiante to draw a line to
     * @param {Number} y the y coordiante to draw a line to 
     */
    lineTo(x, y) {
        this._commands.push("L" + x + "," + y)
    }

    /**
     * horizontalLineTo()
     * @description draws a line to the x coordinate with the current y
     * @param {Number} x the x coordinate to draw the line to 
     */
    horizontalLineTo(x) {
        this._commands.push("H" + x)
    }

    /**
     * verticalLineTo()
     * @description draws a line to the y coordinate with the current x
     * @param {Number} y the y coordinate to draw the line to 
     */
    verticalLineTo(y) {
        this._commands.push("H" + y)
    }

    /** 
     * curveTo() 
     * @description draws a bezier curve to an end point with 2 control points, 
     * one for the start and one for the end of the curve. 
     * @param x1 the x coordinate of the start control point
     * @param y1 the y coordinate of the start control point
     * @param x2 the x coordiante of the end control point 
     * @param y2 the y coordinate of the end control point
     * @param x the x coordinate of the end point 
     * @param y the y coordinate of the end point
     */
    curveTo(x1, y1, x2, y2, x, y) {
        this._commands.push("C " + x1 + "," + y1 + " " + x2 + "," + y2 + " " + x + "," + y)
    }


    /**
     * smoothCurveTo()
     * @description draws a smooth curve with control point to a point x,y. A smooth curve has the one control 
     *  inffered from the other
     * @param x2 x coordinate of the control point 
     * @param y2 y coorindate of the control point
     * @param x x coordinate of the end point 
     * @param y y coordinate ot the end point
     */
    smoothCurveTo(x2, y2, x, y) {
        this._commands.push("S " + x2 + "," + y2 + " " + x + "," + y)
    }


    /**
     * quadraticCurveTo()
     * @description draws a quadratic curve with control point to a point x,y.
     * @param x1 x coordinate of the control point 
     * @param y1 y coorindate of the control point
     * @param x x coordinate of the end point 
     * @param y y coordinate ot the end point
     */
    quadraticCurveTo(x1, y1, x, y) {
        this._commands.push("Q " + x1 + "," + y1 + " " + x + "," + y)
    }

    /**
     * quadraticSmoothCurveTo()
     * @description draws a smooth curve to point x,y.
     * @param x x coordinate of the end point 
     * @param y y coordinate ot the end point
     */
    quadraticSmoothCurveTo(x, y) {
        this._commands.push("T " + x + "," + y)
    }

    /**
     * ellipticalArc()
     * @description draws an elliptical arc with radii rx, and ry, centered at point x y
     * @param rx the x radius of the elliptical arc 
     * @param ry the y radius of the elliptical arc
     * @param xAxisRotation the x axis rotation of the arc
     * @param largeArcFlag the flag for the largeArc ??
     * @param sweepFlag the flag for the sweep ???
     * @param x x coordinate to end the path 
     * @param y y coordinate to end the path
     */
    ellipticalArc(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
        this._commands.push(
            "A " + rx + " " + ry + " " + xAxisRotation + " " + largeArcFlag + + " " + sweepFlag + " " + x + " " + y
        )
    }


    /**
     * catmullRomCurveTo() ??
     * @description creates the path for a catmull rom curve to a point
     * @param x1 the x coordinate of the control point 
     * @param y1 the y coorindate of the control point 
     * @param x the x coordinate 
     * @param y the y coordinate
     */
    catmullRomCurveTo(x1, y1, x, y) {
        this._commands("R " + x1 + " " + y1 + " " + x + " " + y)
    }

    /**
     * createSVG()
     * @description creates the svg graphic for this path
     */
    createSVG(snap) {
        this._svg = snap.path(this.toString())
        this._svg.attr({
            fill: "none",
            stroke: "black"
        })
    }


    /**
     * animateObjectAlongPath()
     * @param {GameObject} gameObject the game object to animate 
     * @param {Number} start the starting point of the animation
     * @param {Number} duration the duration of the animation
     * @param {Function} callback the function called after the end of the animation
     */
    animateObjectAlongPath(gameObject, start, duration, callback) {
        let length = Snap.path.getTotalLength(this._svg)
            
        Snap.animate(start, length, (value) => {
            let movePoint = Snap.path.getPointAtLength(this._svg, value);

            gameObject.svg.attr({ x: movePoint.x, y: movePoint.y })
        }, duration, null, () => callback(this._svg))
    }
}


