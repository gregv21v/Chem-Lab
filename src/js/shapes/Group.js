
export default class Group {
    /**
     * constructor()
     * @description constructs the group
     */
    constructor() {
        this._position = {x: 0, y: 0};
        this._objects = []; // shapes within the group
    }


    /**
     * rotateAroundCenter()
     * @description rotates the group around its center
     */
    rotateAroundCenter(angle) {
        // find the center
        let center = this.center;

        for (const obj of this._objects) {
            obj.rotateAroundPoint(center, angle)
        }
    }


    /**
     * rotateAroundPoint()
     * @description rotates the group around a point
     * @param {Point} point the point to rotate around
     * @param {Degrees} angle the angle to rotate by
     */
    rotateAroundPoint(point, angle) {
        for (const obj of this._objects) {
            obj.rotateAroundPoint(point, angle);
        }
    }


    /**
     * update() 
     * @description updates the objects in the group
     */
    update() {
        for (const obj of this._objects) {
            obj.update()
        }
    }

    /**
     * create()
     * @description creates the objects in the group
     */
    create() {
        for (const obj of this._objects) {
            obj.create()
        }
    }


    /**
     * add()
     * @description adds a shape to the group
     * @param {Shape} shape the shape to add to the group
     * @param {Number} x the local x coordinate of the shape
     * @param {Number} y the local y coordinate of the shape
     */
    add(shape) {
        //shape.x = this.position.x + x;
        //shape.y = this.position.y + y;
        this._objects.push(shape)
    }


    
    /**
     * findObjectNearestPoint()
     * @description find the object closest to a point
     * @param {Point} point the point the object should be near
     * @returns the nearest object
     */
    findObjectNearestPoint(point) {
        // find the closest snappable region that
        // intersects

        var index = 0;
        var closestDistance = Infinity;


        for (let i = 0; i < this.objects.length; i++) {
            let center = this.center
            let distance = Distance(center, point)

            // find the closest intersecting snap area
            if (distance < closestDistance) {
                closestDistance = distance
                index = i
            }
        }

        return this.objects[index];
    }


    /**
     * moveBy()
     * @description moves the group by delta
     * @param {Number} deltaX the difference in x to move the group
     * @param {Number} deltaY the difference in y to move the group
     */
    moveBy(deltaX, deltaY) {
        for (const obj of this._objects) {
			obj.moveBy(deltaX, deltaY)
		}
    }


    /**
     * moveTo()
     * @description Moves the center of the group to a specified location
     * @param {Number} x the x coordinate to move to
     * @param {Number} y the y coordinate to move to
     */
    moveTo(x, y) { 

        let delta = {
            x: x - this.center.x,
            y: y - this.center.y 
        }

        for (const obj of this._objects) {
            obj.moveBy(delta.x, delta.y);
        }
    }


    /**
     * get objects()
     * @description gets the objects in the group
     */
    get objects() {
        return this._objects;
    }

    /**
     * get center()
     * @description gets the center of the group
     */
    get center() {
        // convert every shape in the group to points
        // the calculate the center by averaging the points
        let total = {
            x: 0,
            y: 0
        }

        for (const obj of this._objects) {
            total.x += obj.center.x 
            total.y += obj.center.y 
        }

        return {
            x: total.x / this._objects.length,
            y: total.y / this._objects.length
        }
    }

    destroy() {
        
    }


    /**
	 * scale()
	 * @description scales the rectangle by the given amount
	 * @param {Number} amount the amount to scale the rectangle by
	 */
	scale(amount) {
        for (const obj of this._objects) {
            //let originalPosition = obj.position;

            //obj.moveTo(this.center.x, this.center.y);
            obj.scale(amount);
            //obj.moveTo(originalPosition.x, originalPosition.y);


        }
	}


	/**
	 * scaleHeight()
	 * @description scales the y dimension of all objects in the group
	 * @param {Number} amount the amount to scale the y dimension by
	 */
	scaleY(amount) {
		for (const obj of this._objects) {
            obj.scaleHeight(amount);
        }
	}

	/**
	 * scaleWidth()
	 * @description scales the x dimension of all objects in the group
	 * @param {Number} amount the amount to scale the x dimension by
	 */
	scaleX(amount) {
		for (const obj of this._objects) {
            obj.scaleWidth(amount);
        }
	}


    /**
     * getMinX() 
     * @description returns the minimum x value of the group
     */
    getMinX() {
        let xMin = Infinity;
        for (const obj of this._objects) {
            let points = obj.toPoints();
            for (const point of points) {
                if(point.x < xMin) {
                    xMin = point.x;
                }
            }
        }
        return xMin;
    }


    /**
     * getMaxX() 
     * @description returns the maximum x value of the group
     */
    getMaxX() {
        let xMax = -Infinity;
        for (const obj of this._objects) {
            let points = obj.toPoints();
            for (const point of points) {
                if(point.x > xMax) {
                    xMax = point.x;
                }
            }
        }
        return xMax;
    }


    /**
     * getMinX() 
     * @description returns the minimum x value of the group
     */
    getMinY() {
        let yMin = Infinity;
        for (const obj of this._objects) {
            let points = obj.toPoints();
            for (const point of points) {
                if(point.y < yMin) {
                    yMin = point.y;
                }
            }
        }
        return yMin;
    }


    /**
     * getMaxX() 
     * @description returns the maximum x value of the group
     */
    getMaxY() {
        let yMax = -Infinity;
        for (const obj of this._objects) {
            let points = obj.toPoints();
            for (const point of points) {
                if(point.y > yMax) {
                    yMax = point.y;
                }
            }
        }
        return yMax;
    }

    /**
     * get width()
     * @description gets the width of the group
     * @returns {Number} the width of the group
     */
    get width() {
        // the min x, and max x. The difference between them is the width
        let xMin = this.getMinX();
        let xMax = this.getMaxX();
        return xMax - xMin;
    }


    /**
     * get height()
     * @description returns the height of the group
     * 
     */
    get height() {
        let yMin = this.getMinY();
        let yMax = this.getMaxY();
        return yMax - yMin;
    }

  


    /**
     * get position()
     * @description gets the position of the group
     * @returns {Point} the position of the group
     */
    get position() {
        return this._position;
    }


    /**
     * set position()
     * @description sets the position of the group
     * @param {Point} position the position of the group
     */
    set position(value) { 
        this._position = value;
    }


    


}