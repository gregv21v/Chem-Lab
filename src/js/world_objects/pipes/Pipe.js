/**
 * Pipe - a pipe
 */

import Tank from "../tanks/Tank"
import * as d3 from "d3"
import Rect from "../../shapes/Rect";
import Snappable from "../Snappable";
import SnapPoint from "../SnapPoint";
import Group from "../../shapes/Group";
import Arrow from "../../shapes/Arrow";
import { getNextSide, getOpposite } from "../../util";
import { rotatePoint } from "../../shapes/Point";

export default class Pipe extends Snappable {


	/**
	 * constructor()
	 * @description constructs the pipe
	 * @param {Vector} center the center of the pipe
	 * @param {Number} width the width of the pipe
	 * @param {Number} interiorHeight the interior height of the pipe
	 * @param {Number} wallWidth the wall width of the pipe
	 */
	constructor(layer, center, length, interiorHeight, wallWidth) {
		super(layer, center)

		this._diameter = interiorHeight + wallWidth * 2;
		this._length = length;

		this._wallWidth = wallWidth;
		this._interiorHeight = interiorHeight;
		this._position = center
		//this.center = center; // position of pipe
		this._width = length;
		this._height = interiorHeight + wallWidth * 2;
		this._opened = true;

		this._drops = [];

		this._rect = new Rect(this.position, this.width, this.height);
		this._rotation = 0;
		this._direction = "left"

		this._description = [
			"Pipes move fluid from one ",
			"tank to another depending on", 
			"the direction of the arrow"
		]

		//this.updatePosition();

  	}

	/**
	 * createSnapPoint() 
	 * @description creates the snap points of the tank
	 */ 
	createSnapPoints() {
		this._snapWidth = 20;
		this._snapPoints = [];

		// start
		this._snapPoints.push(
			new SnapPoint(
				{
					x: this.position.x - this._snapWidth,
					y: 0
				},
				this._snapWidth,
				this.height,
				{
					x: this.position.x, 
					y: this.position.y + this.height / 2
				},
				"x",
				"left"
			)
		)
		this._snapPoints[0].stroke.opacity = 0;
		this._snapPoints[0].stroke.color = "blue"
		this._snapPoints[0].fill.opacity = 0;
		this._snapPoints[0].fill.color = "orange"
		this._snapPoints[0].create();
		this._snapGroup.add(this._snapPoints[0]);

		// end
		this._snapPoints.push(
				new SnapPoint(
				{
					x: this.position.x + this.width,
					y: 0
				},
				this._snapWidth,
				this.height,
				{
					x: this.position.x + this.width,
					y: this.position.y + this.height / 2
				},
				"x",
				"right"
			)
		)
		this._snapPoints[1].stroke.opacity = 0;
		this._snapPoints[1].stroke.color = "blue"
		this._snapPoints[1].fill.opacity = 0;
		this._snapPoints[1].fill.color = "orange"
		this._snapPoints[1].create();
		this._snapGroup.add(this._snapPoints[1]);

		

		
	}


	

	/**
	 * getDropStartPosition()
	 * @description gets the start position of the drop in the pipe
	 * @param {Side} side the side of the tank the pipe is on
	 */
	getDropStartPosition(snapPoint) {
		return this.getSnapPointCenter(snapPoint);
	}

  	/***
   	 * transferLiquid()
   	 * @description transfers liquid to connected tanks
  	 */
  	transferLiquid() {
		// go through all the attachments for all the pipes
		// get the existing drops 
		let exitingDrops = this.takeExitingDrops();
		//console.log(exitingDrops);

		let snapPoints = {
			left: this._snapPoints.find(snapPoint => snapPoint.side === "left"),
			right: this._snapPoints.find(snapPoint => snapPoint.side === "right"),
			up: this._snapPoints.find(snapPoint => snapPoint.side === "up"),
			down: this._snapPoints.find(snapPoint => snapPoint.side === "down")
		}

		//console.log(snapPoints);

		// find the exiting tank
		for (const drop of exitingDrops) {
			if(snapPoints[drop.direction] && snapPoints[drop.direction].attachments.length > 0) {
				let tank = snapPoints[drop.direction].attachments[0];
				if(tank instanceof Tank) {
					tank.addDrop(drop);
					drop.destroy();
					tank.updateFluidBodies();
				}
			} else {
				this._drops.push(drop);
			}
		}
  	}


	

	/**
	 * @description adds a drop to the pipe
	 * @param {Drop} drop the drop to add
	 */
	addDrop (drop) {
		this._drops.push(drop)
	};

	/**
	 * takeExitingDrops()
	 * @description takes the exiting drops from the pipe
	 */
	takeExitingDrops() {

		// search for available drops
		var exitingDrops = []; // drops at their exit.
		var keptDrops = []; // drops that are not about to exit
		for(const drop of this._drops) {
			//debugger
			//console.log(drop);
			// if a drop can no longer flow in the direction it was
			// flowing, give it is at its spout, and ready to leak.
			if(!drop.canFlow(this)) {
				exitingDrops.push(drop);
				//console.log("Direction: " + drop.direction)
				//console.log("Exiting");
			} else {
				keptDrops.push(drop);
			}
		}
		this._drops = keptDrops;
		return exitingDrops;
	};


	/**
	 * updateDrops()
	 * @description update the drops within the pipe
	 */
	updateDrops() {
		// check if 
		for(const x in this._drops) {
			if(this._drops[x].canFlow(this)) {
				this._drops[x].flow();
			}
		}
	};

	/*
		=============Drawing the Pipe=============
	*/
	create() {
		this._group = this._layer.append("g")
		this._group.attr("name", "Pipe")

		this._boundingBox.position = this._position;
		this._boundingBox.width = this._width
		this._boundingBox.height = this._height
		this._boundingBox.fill.opacity = 0
		this._boundingBox.stroke.opacity = 0;
		this._boundingBox.create();	


		this._arrow = new Arrow(
			d3.select("[name='fluids']"),
			this._diameter/4 - this._wallWidth*2,
			this.center
		)

		this._arrow.stroke.color = "red"
		this._arrow.stroke.opacity = 1;
		this._arrow.fill.opacity = 0;
		this._arrow.create();

		this._graphicsGroup = this.createGraphics(this._group);
		this._graphicsGroup.add(this._arrow);

		this.createSnapPoints();
	}


	/**
	 * createGraphics()
	 * @description creates the graphics for the pipe 
	 * @param {svgGroup} svgGroup the svg group for the graphics
	 */
	createGraphics(svgGroup) {
		
		let group = new Group();

		let walls = new Rect(
			svgGroup, 
			{...this.position},
			this._length,
			this._diameter
		)
		walls.fill.color = "black"
		walls.fill.opacity = 1
		walls.stroke.color = "black"
		walls.stroke.opacity = 0;
		walls.create();
		group.add(walls)

		let interior = new Rect(
			svgGroup, 
			{x: this._position.x - this._wallWidth, y: this._position.y + this._wallWidth},
			this._length + this._wallWidth * 2,
			this._interiorHeight
		)
		interior.stroke.opacity = 0;
		interior.fill.color = "white"
		interior.fill.opacity = 1
		interior.create();
		group.add(interior)

		return group;
	}


	update() {
		this._graphicsGroup.update();
		this._boundingBox.update();
		this._snapGroup.update();
	}

	destroySVG() {
		this._group.remove()
	}
	/*
		==========================================
	*/

	/**
	 * rotate() 
	 * @description rotates the pipe
	 */
	rotate() {
		this._rotation = (this._rotation + 90) % 360
	
		let directions = ["left", "up", "right", "down"]

		this._direction = directions[this._rotation / 90]

		for (const snap of this._snapGroup.objects) {
			if(snap instanceof SnapPoint) {
				snap.axis = (snap.axis === "x") ? "y" : "x"
				snap.side = getNextSide(snap.side);
			}
		}
		this._graphicsGroup.rotateAroundCenter(90)
		this._boundingBox.rotateAroundCenter(90);
		this._snapGroup.rotateAroundCenter(90);
	}

	/**
	 * set rotation()
	 * @description sets the rotation of the pipe
	 */
	set rotation(value) {
		this._rotation = value;
	}

	/**
	 * get rotation()
	 * @description gets the rotation of the pipe
	 * @returns rotation of the pipe
	 */
	get rotation() {
		return this._rotation;
	}

	/**
	 * snapAdjustments() 
	 * @description these are adjustments made to the relative position of two snapping objects 
	 * @param {Pair} pair the pair of objects being snapped 
	 * @param {Rect} movingObject the object being moved
	 */
	snapAdjustments(pair) {


		
		if(pair.fixed.side === "left" && pair.fixed.point.x < this.center.x) {
			this.moveBy({
				x: -this.boundingBox.width,
				y: 0
			})
		} 

		if(pair.fixed.side === "right" && pair.fixed.point.x > this.center.x) {
			this.moveBy({
				x: +this.boundingBox.width,
				y: 0
			})
		} 
		

		if(pair.fixed.side === "up" && pair.fixed.point.y < this.center.y) {
			this.moveBy({
				x: 0,
				y: -this.boundingBox.height
			})
		} 

		if(pair.fixed.side === "down" && pair.fixed.point.y > this.center.y) {
			this.moveBy({
				x: 0,
				y: this.boundingBox.height
			})
		} 

		
	}



	/************************************************
		Physical Properties
	************************************************/
	

  

	getDropSize() {
		return this._interiorHeight;
	};

  	/**
	 * get rect()
	 * @description gets the rect for this pipe
	 */
	get rect() {
		this._rect.position = this.position;
		this._rect.width = this.width
		this._rect.height = this.height
		return this._rect
	}

	/**
	 * get name()
	 * @returns gets the name of the pipe
	 */
	get name() {
		return "Pipe";
	}


	/**
	 * get length()
	 * @description gets the length of the pipe
	 * @returns the length of the pipe
	 */
	get length() {
		return this._length;
	}

	/**
	 * get diameter() 
	 * @description gets the diameter of the pipe
	 */
	get diameter() {
		return this._diameter;
	}

	/**
	 * set diameter() 
	 * @description sets the diameter of the pipe
	 * @param {Number} value the new diamater
	 */
	set diameter(value) {
		this._diameter = value;
	}

	/**
	 * get height()
	 * @returns the height of the pipe
	 */
	get height() {
		return this._boundingBox.height;
	}
  
	/**
	 * get width()
	 * @returns the width of the pipe
	 */
	get width() {
		return this._boundingBox.width;
	}


	/**
   	 * get opened()
   	 * @returns whether or not the pipe is open
   	 */
	get opened() {
		return this._opened;
	}


	/**
	 * get direction
	 * @description gets the direction drops flow through this Pipe
	 */
	get direction() {
		return this._direction;	
	}


	/**
	 * get boundingBox()
	 * @description gets the bounding box for this pipe
	 * @returns the bounding box
	 */
	get boundingBox() {
		return this._boundingBox;
	}

	

}
