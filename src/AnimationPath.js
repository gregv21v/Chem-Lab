import GameObject from "./world_objects/GameObject";
import * as d3 from "d3"
import Vector from "./shapes/Vector";

/**
 * AnimationPath - the path that a object takes
 */
export default class AnimationPath {

    /**
     * constructor()
     * @description constructs the AnimationPath
     * @param {Number} ticks the number of ticks it takes to traverse the whole path
     */
    constructor(tickLength=20) {
        this._tickLength = tickLength; // how long a tick takes
        //this._ticks = ticks; // the 
        this._points = []; // the nodes along the path
        this._currentPoint = undefined; 
        this._previousPoint = undefined;
    }

    /**
     * addPoint()
     * @description adds a point to the path
     * @param {Point} point the point to add to the path
     */
    addPoint(point) {
        this._points.push(point);
    }


    /**
     * traverse()
     * @description move the game object along the path
     * @param {GameObject} gameObject the game object that will traverse the path
     * @param {Number} duration the amount of time it takes to complete the traversal
     */
    traverse(gameObject, duration=5000) {
        if(this._points.length < 2) {
            return console.error("You don't have enough points in the path.")
        } else {
            
            let index = 0;
            let self = this;

            // get the total length of the path
            let currentPoint = this._points[0];
            let nextPoint = this._points[1];
            let pathLength = 0
            for (let index = 1; index < this._points.length; index++) {
                pathLength += currentPoint.distanceTo(nextPoint)

                currentPoint = this._points[index]
                nextPoint = this._points[index+1]
            }

            // Feature: determine the speed of the liquid traveling through
            //  the pipe by its density, or another property called weight
            
            // Knowns: 
            //  duration
            //  points 

            // Need to know:
            //  direction 
            //  amount of ticks it takes to get from one point to another
            
            let velocity = new Vector(0, 0)
            let tickLength = 20
            let totalTicks = duration / tickLength
            currentPoint = this._points[0];
            nextPoint = this._points[1];

            let timer = setInterval(() => {
                let ticksPerThisSegment = totalTicks * (currentPoint.distanceTo(nextPoint) / pathLength);

                // I want the game object to be going at a constant speed 
                // throughout the animation

                // use a normalized directional vector
                velocity = nextPoint.subtract(currentPoint).divide(ticksPerThisSegment)


                // move the game object in the direction of 
                // nextPoint
                gameObject.position = gameObject.position.add(velocity);
                gameObject.updateSVG()

                // once it reaches the destination point change directions 
                // and go to the next point
                let distanceToNextPoint = gameObject.position.distanceTo(nextPoint) 
                if(distanceToNextPoint > -0.1 && distanceToNextPoint < 0.1) {
                    index++
                    currentPoint = this._points[index]
                    nextPoint = this._points[index+1]
                    
                }

            
            }, tickLength)
        }
    }

    /**
     * traverse()   
     * @description have a game object traverse a path. Requires at least two 
     *  points to be present in the path
     * @param {GameObject} gameObject the game object that will traverse this path
     */
    
    traverse2(gameObject) {
        
        if(this._points.length < 2) {
            console.error("You don't have enough points in the AnimationPath.")
        } else {
            let currentPoint;
            let nextPoint;
            let index = 0;
            let tick = 0;
            let self = this;

            // the number of ticks from one point to the next
            let ticksBetweenPoints = this._ticks / (this._points.length - 1) 

            let timer = setInterval(() => {
                if(index >= self._points.length-1) {
                    // exit animation
                    clearInterval(timer);
                    return;
                }

                tick++;

                console.log(index);

                currentPoint = self._points[index] // point 0
                nextPoint = self._points[index+1] // point 1

                let xDelta = (nextPoint.x - currentPoint.x) / ticksBetweenPoints;
                let yDelta = (nextPoint.y - currentPoint.y) / ticksBetweenPoints;

                gameObject.position = new Vector(
                    currentPoint.x + (xDelta * tick),
                    currentPoint.y + (yDelta * tick)
                )
                gameObject.updateSVG()

                if(ticksBetweenPoints <= tick) {
                    index++
                    tick = 0;
                }
            }, 20)
        }
    }
}