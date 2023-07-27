/*
  Snappable2 - the second version of the snappable class

*/
import Rect from "../shapes/Rect"
import { Distance } from "../shapes/Point"
import * as d3 from "d3"
import Group from "../shapes/Group"
import SnapPoint from "./SnapPoint"
import { getAreaOfIntersection, getOpposite } from "../util"

export default class Snappable extends Rect {
  constructor(layer, position, width, height) {
    super(layer, position, width, height) 

    this._rotation = 0;
    this._graphicsGroup = new Group(); // the place where all the graphic objects are stored
    this._snapGroup = new Group(); // the place where the snap points are stored

    this._boundingBox = new Rect(
			d3.select('[name="debug"]'),
			position,
			width,
			height
		)
		this._boundingBox.fill.opacity = 0
		this._boundingBox.stroke.opacity = 0;

    this._snapRadius = 30
  }


  /**
   * create() 
   * @description creates the snappable
   */
  create() {
    this._graphicsGroup.create();
    this._boundingBox.create();
    this._snapGroup.create();
  }

  /**
   * createGraphics()
   * @description creates the graphics for the snappable
   * @param {SVGAElement} svg the svg element to attach the graphics to (
   */
  createGraphics(svg) {
    return new Group();
  }



  // Rotating should maintain consistency
  // between the snap areas and their corresponding
  // sides.
  rotate() {
    this._rotation = (this._rotation + 90) % 360
    

    this.rotateAroundCenter(90)
  };

  /**
	 * update()
	 * @description updates the attributes of the snappable
	 */
	update() {
		this._snapGroup.update();
    this._graphicsGroup.update();
    this._boundingBox.update();
	}



  /**
   * get rect()
   * @description gets a rectangle representing
   *  the area of the valve
   */
  get rect() {
    var newRect = new Rect();
    newRect.position = this._position
    newRect.width = this.width; // horizontal dimension
    newRect.height = this.height; //   vertical dimension

    //newRect.createSVG()
    return newRect;
  };

  /**
    moveTo()
    @description moves to a given point, where the center of the Snappable is
      fixed at the given point
    @param point the point to center on
  */
  moveTo(point) {

		let delta = {
			x: point.x - this._position.x,
			y: point.y - this._position.y
		}

    this.moveBy(delta);
    this._boundingBox.position = this._position
  }

  /**
   * moveBy()
   * @description moves the position of the Snappable by delta
   * @param {Point} delta the difference between the current position and the new position
   */
  moveBy(delta) {
    this._position.x += delta.x;
    this._position.y += delta.y;
    this._graphicsGroup.moveBy(delta.x, delta.y)
    this._snapGroup.moveBy(delta.x, delta.y)
    
  }

  /**
   * TO REMOVE
   * move()
   * @description moves by a certain x and y amount
   * @param {Point} delta the distance to move in the x and y 
   */
  move(delta) {
    this._position.x += delta.x;
    this._position.y += delta.y;
  }




  /**
	 * snapAdjustments() 
	 * @description these are adjustments made to the relative position of two snapping objects 
	 * @param {Pair} pair the pair of objects being snapped 
	 * @param {Rect} movingObject the object being moved
	 */
	snapAdjustments(pair) {
  }

  /**
   * moveRelativeToCenter()
   * @description moves the Snappable relative to it's center
   * @param point point to move to
   */
  moveRelativeToCenter(point) {
    /*let lastPosition = {...this._position};
		this._position.x = point.x - this._boundingBox.width / 2;
		this._position.y = point.y - this._boundingBox.height / 2;

		let delta = {
			x: this._position.x - lastPosition.x,
			y: this._position.y - lastPosition.y
		}

    this._objectGroup.move(delta.x, delta.y)*/
  }


  /**
   * showSnapAreas()
   * @description shows the snap areas
   */
  showSnapAreas() {
    /*for (const obj of this._snapGroup.objects) {
      if(obj instanceof SnapPoint) {
        obj.create()
      }
    }*/
  };

  /**
   * hideSnapArea()
   * @description hide the snap areas
   */
  hideSnapAreas() {
    let snapAreas = this.getSnapAreas()
    for (const key of Object.keys(snapAreas)) {
      snapAreas[key].destroySVG()
    }
  };

  

 

  /**
   * findClosestSnapArea()
   * @description finds the closest snap area to a given point that intersects with this snappable
   * @param mousePos position of mouse
   */
  findClosestSnapPoint(snappable, mousePos) {
    // find the closest snappable region that
    // intersects

    var closestSnapPoint = -1;
    var closestDistance = Infinity;
    var thisRect = this.rect

    for (let i = 0; i < snappable.snapGroup.objects.length; i++) {
      let snapPoint = snappable.snapGroup.objects[i]

      if(snapPoint instanceof SnapPoint) {
        var distance = Distance(snapPoint.center, mousePos)
        // find the closest intersecting snap area
        if (distance < closestDistance && thisRect.intersects(snapPoint)) {
          closestDistance = distance
          closestSnapPoint = i
          this._snapping = true;
        }
      }
    }

    //console.log(closestSnapPoint);
    return snappable.snapGroup.objects[closestSnapPoint];
  }

  /**
   * findSnapPointNearPoint()
   * @description find the closest snap point to another snap point
   * @param {Point} snapPoint the point the snap point should be near
   * @returns the index of the nearest snap point
   */
  findSnapPointNearSnapPoint(snapPoint) {
    // find the closest snappable region that
    // intersects
    var index = 0;
    var closestDistance = Infinity;

    for (let i = 0; i < this._snapGroup; i++) {
      let obj = this._snapGroup.objects[i];
      let center = obj.center
      let distance = Distance(center, snapPoint.center)

      // find the closest intersecting snap area
      if (distance < closestDistance) {
        closestDistance = distance
        index = i
      }
    }

    return this._snapGroup.objects[index];
  }

  /**
   * findClosestSnappingPair() 
   * @description finds the two closest snapping points
   * @param {Snappable} snappable the snappable to pair with
   * @returns {Object} an object contain the pair of snappables
   */
  findClosestSnappingPair(snappable) {
    let closestDistance = Infinity;
    let closestPair = {
      moving: null,
      fixed: null
    }

    // find the two snap points that are closest to each other
    for (const movingPoint of this.objectGroup.objects) {
      if(movingPoint instanceof SnapPoint) {
        for (const fixedPoint of snappable.objectGroup.objects) {
          if(fixedPoint instanceof SnapPoint) {
            let dist = Distance(fixedPoint.center, movingPoint.center)
            if(dist < closestDistance && this.rect.intersects(fixedPoint)) {
              closestDistance = dist;
              closestPair = {
                moving: movingPoint,
                fixed: fixedPoint
              }
            }
          }
        }  
      }
    } 

    return closestPair;
  }

  


  /**
   * snapTo()
   * @description snaps a given object to this object depending on where the mouse is
   * @param {Object} closestPair the closest pair of snapping points
   * @param {Point} mousePos the position of the mouse 
   * @returns the closest side that can be snapped to
   */
  flexibleSnap(otherSnappable, mousePos) {

    let fixedPoints = otherSnappable.snapPoints; // check
    let movingPoints = this.snapPoints; // check

    console.log(fixedPoints);
    console.log(movingPoints);

    // find the two closest points
    let largestArea = -Infinity
    let pair = {
      fixed: fixedPoints[0],
      moving: movingPoints[0]
    }
    
    // get all the snap regions that intersect with the moving rect
    //console.log(fixedPoints);
    for(let point of fixedPoints) {
        console.log(this._boundingBox);
        let area = getAreaOfIntersection(point, this._boundingBox);
        console.log(area);
        
        if(area > largestArea && point.intersect(this._boundingBox)) {
          largestArea = area;
          pair.fixed = point
        }
    }
  
    
    // find the moving area that is closet to the fixed area 
    for(let point of movingPoints) {
      if(point.side === getOpposite(pair.fixed.side)) {
        pair.moving = point
      }
    }
    
    /*console.log(pair);
    if(pair.fixed) {
      
      this.move({
          x: (pair.fixed.axis === "x") ? pair.fixed.position.x - this.position.x: 0,
          y: (pair.fixed.axis === "y") ? pair.fixed.position.y - this.position.y: 0
      })
      
      this.move({
        x: (pair.moving.side === "right" && pair.fixed.axis === "x") ? -this.width : 0,
        y: (pair.moving.side === "down" && pair.fixed.axis === "y") ? -this.height : 0
      })
    }*/

    //return pair.moving;

  }

  /**
   * getDropStartPoint() 
   * @param {SnapPoint} snapPoint the snap point to start the drop at 
   * @param {Drop} drop the drop to start
   * @description gets the point where a drop starts in a pipe. 
   */
  getDropStartPoint(snapPoint, drop) {
    let point = {
      x: this.position.x + drop.size / 2,
      y: this.position.y + drop.size / 2
    }

    // based on the axis set the x or y position
    if(snapPoint.axis === "x") {
      point.x = snapPoint.point.x - drop.size / 2
    } else {
      point.y = snapPoint.point.y - drop.size / 2
    }

    return point;
  }


  /**
   * get position()
   * @description gets the position of the snappable
   * @returns {Point} position
   */
  get position() {
    return this._position;
  }

  /**
   * set position()
   * @description sets the position of the snappable
   * @returns {Point} position
   */
  set position(value) {
    this._position = value;
  }


  /**
   * get height()
   * @description the width of the shape of the object irregardless of
   * of what type of object it is
   */
  get width() {
    return -1;
  };

  /**
   * get height()
   * @description the height of the shape of the object irregardless of
   *  of what type of object it is
   */
  get height() {
    return -1;
  };


  /**
   * get objectGroup()
   * @description gets the snap group of the snappable
   * @returns {Array[SnapPoint]} the snap group of the snappable
   */
  get objectGroup() {
    return this._objectGroup;
  }


  /**
   * get snapPoints() 
   * @description gets the snap points of the snappable
   * @returns {Array[SnapPoint]} the snap points of the snappable
   */
  get snapPoints() {
    return this._snapGroup.objects;
  }

  /**
	 * get center()
	 * @returns the center point of the rectangle
	 */
	get center() {
		return {
			x: this._boundingBox.x + this._boundingBox.width / 2,
			y: this._boundingBox.y + this._boundingBox.height / 2
		}
	}

  /**
	 * get boundingBox()
	 * @description gets the bounding box for this snappable
	 * @returns the bounding box
	 */
	get boundingBox() {
		return this._boundingBox;
	}


  /**
   * get description()
   * @description gets the description
   */
  get description() { 
    return this._description;
  }


  /**
	 * getThumbnail()
	 * @description gets a thumbnail to represent this game object with the dimensions of width and height
   * @param {Number} x the x coordinate
   * @param {Number} y the y coordinate
	 * @param {Number} width the width of the thumbnail
	 * @param {Number} height the height of the thumbnail
   * @param {SVGElement} group the group to add the thumbnail to
	 */
	getThumbnail(x, y, amount, group) {
		let graphics = this.createGraphics(group);

    console.log(graphics);
    graphics.moveTo(x + graphics.width / 2, y + graphics.height / 2);
    graphics.scale(amount);
    graphics.update();
		

		return graphics;
	}

}
