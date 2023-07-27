/*
	The world contains all the game objects.
*/
import Pipe from "./world_objects/pipes/Pipe";
import Rect from "./shapes/Rect";
import Tank from "./world_objects/tanks/Tank";
import { Distance } from "./shapes/Point"
import { getOpposite } from "./util";
import * as d3 from "d3"
import GameObject from "./world_objects/GameObject";
import Snappable from "./world_objects/Snappable";
import Pump from "./world_objects/Pump";
import Heater from "./world_objects/Heater";

export default class World {
	constructor(game, player, position, width, height) {
		this._game = game;
		this.player = player;
		this.snapPoint = null;
		this.snappingTo = null;

		// The side that the given object (snappingTo) is on.
		this.objectOn = ""
		this.mouseObj = null; // the object centered on the mouse
		this.rect = new Rect(this._game.layers[0]);
		this.rect.position = position;
		this.rect.width = width;
		this.rect.height = height;
		this.rect.stroke.width = 10;
		this.rect.stroke.color = "black";
		this.drops = [];
		this.objs = [];
		this.lines = []
		this._snappedPair = null;


		
		

		let mainSVG = d3.select("svg");
		let self = this;
		/*****************************************************
				 Mouse Interactions
		*****************************************************/
		/*
			Mouse Movement
		*/
		mainSVG.on('mousemove', function(evnt) {
			self.mouseMoveHandler(evnt);
		});

		/*
			Mouse Down
		*/
		mainSVG.on('mousedown', function(evnt) {
			self.mouseDownHandler(evnt);
		});

	}


	/**
		mouseDownHandler()
		@description handles the mouse down event
		@param evnt the mouse down event
	*/
	mouseDownHandler(evnt) {
		// place the object in the world
		// when you are not in the inventory, and have selected a button
		if(this.player.hand &&
			!this._game.hud.inventory.contains({x: evnt.clientX, y: evnt.clientY}))
		{

			

			// Move the object to the world
			if(this.player.hand) {
				if(this._fixedSnappable) {
					// get the snap point on the object that is moving
					this._snappedPair.fixed.attach(this.player.hand);
					this._snappedPair.moving.attach(this._fixedSnappable);
				}


				//if(!(this.player.hand instanceof Pump))
					//this.player.hand.showSnapAreas()
				this.add(this.player.hand);
				this.player.hand = null; // empty hand
				this._fixedSnappable = null;
				this.update();
			}

		}

		console.log("Objects --------------------------------");
		for (const obj of this.objs) {
			console.log(obj);
		}
	}

	/**
		mouseMoveHandler()
		@description handles the movement of the mouse in the world
		@param evnt the mouse event
	*/
	mouseMoveHandler(evnt) {
		var mousePos = {x: evnt.clientX, y: evnt.clientY};

		if(this.player.hand != null) {

			/*for (var i = 0; i < this.lines.length; i++) {
				var objCenter = this.objs[i].center
				this.lines[i]
					.style("stroke", "orange")
					.attr("x1", objCenter.x)
					.attr("y1", objCenter.y)
					.attr("x2", mousePos.x)
					.attr("y2", mousePos.y)
			}*/

			
			if(!(this.player.hand instanceof Pump)) {
				console.log("Move To");
				this.player.hand.moveTo({
					x: mousePos.x - this.player.hand.boundingBox.width / 2,
					y: mousePos.y - this.player.hand.boundingBox.height / 2
				});
			} else {
				this.player.hand.moveTo(mousePos);
			}
			
			this._fixedSnappable = this.findClosestSnappable(mousePos) // check
		
			
			if(this.player.hand instanceof Snappable && this._fixedSnappable != null) {
				//closestSnappable.boundingBox.fill.opacity = 1;
				//closestSnappable.boundingBox.fill.color = "orange";
				//closestSnappable.boundingBox.update();
				this.flexibleSnap(this._fixedSnappable, this.player.hand);
			} 
			this.player.hand.update()
			
		}

	}

	/**
	 * flexibleSnap() 
	 * @description allows you to flexibly snap two objects together 
	 * @param {Object} fixedObject the object that doesn't move 
	 * @param {Object} movingObject the object that will snap to the fixed object
	 * @param {Point} mousePos the mouse position
 	 */
	flexibleSnap(fixedObject, movingObject) {
		let fixedPoints = fixedObject.snapPoints;
		let movingPoints = movingObject.snapPoints;

		let largestArea = -Infinity;
		let pair = {
			fixed: fixedPoints[0],
		  	moving: movingPoints[0]
		}

		// get all the snap regions that intersect with the moving rect
		for(let point of fixedPoints) {
			let intersectionArea = point.getAreaOfIntersection(movingObject.boundingBox)
		
			if(intersectionArea > largestArea && movingObject.boundingBox.intersect(point)) {
				largestArea = intersectionArea;
				pair.fixed = point
			}
		}


		// find the moving area that is closet to the fixed area 
		for(let point of movingPoints) {
			if(point.side === getOpposite(pair.fixed.side)) {
				pair.moving = point
		  	}
		}


		if(pair.fixed) {
			movingObject.moveBy({
				x: (pair.fixed.axis === "x") ? pair.fixed.point.x - movingObject.position.x: 0,
				y: (pair.fixed.axis === "y") ? pair.fixed.point.y - movingObject.position.y: 0
			})
			
			movingObject.snapAdjustments(pair);

			this._snappedPair = pair;
		}

	}

	

	/**
		findClosestSnappable()
		@description find the snappable object closest to the mouse position
		@param mousePos the position of the mouse
	*/
	findClosestSnappable(mousePos) {
		// find the closest snappable object to the mouse
		// then try to snap to that.
		let closestSnappable = null
		let closestDistance = Infinity
		for(var obj of this.objs) {
			if(obj instanceof Snappable) {
				let distance = Distance(obj.center, mousePos);

				// TODO: change distance < 100 so that it compares the distance from 
				// one edge to another instead of from center to center
				if(distance < closestDistance && distance > 0 && distance < 100) {
					closestDistance = distance
					closestSnappable = obj
				}
			}
		}
		return closestSnappable;
	}

	/**
		createSVG()
		@description create svg's for all the world objects
	*/
	create() {
		this.rect.create();
		this.rect.update()
	}


	/**
	 * add()
	 * @description Add an object (pump, tank... etc) to the world.
	 * @param obj the GameObject to add to the world
	*/
	add (obj) {
		this.objs.push(obj);

		// for debugging purposes
		//var mainSVG = d3.select("body").select("svg")
		//this.lines.push(mainSVG.append("line"))
	};

	/**
		addDrop()
		@description add a drop to the world
		@param drop the drop to add to the world
	*/
	addDrop (drop) {
		this.drops.push(drop);
	};

	/**
		removeDrop()
		@description Remove a given drop of liquid from the world.
			Used for adding liquid drops to a tank.
	*/
	removeDrop(drop) {
		this.drops = this.drops.filter(function(obj) {
			return obj.id != drop.id;
		});
	};
	/**
		update()
		@description Updates all the objects currently in the world
	*/
	update() {


		for(var i = 0; i < this.drops.length; i++) {
			this.drops[i].update(this);
		}

		// Move fluid drops through pipes
		/*for(const pipe of pipes) {
			pipe.updateDrops();
		}*/



		for(const obj of this.objs) {
			if(obj instanceof Pipe || obj instanceof Tank) {
				if(obj instanceof Pipe) {
					obj.updateDrops();
				}
				obj.transferLiquid();
			}

			if(obj instanceof Heater) {
				obj.heat(this);
			}

			
				
		}

	};




	/**
	 * within()
	 * @description Check to see if a rectangler is entriely in the world
	 * @param {GameObject} gameObject the game object to check
	 */
	within(gameObject) {
		// if all 4 corners of the rect are in the world
		return  (
			this.rect.contains({x: gameObject.position.x, y: gameObject.position.y}) && // top left
			this.rect.contains({x: gameObject.position.x + gameObject.width, y: gameObject.position.y}) && // top right
			this.rect.contains({x: gameObject.position.x, y: gameObject.position.y + gameObject.height}) && // bottom left
			this.rect.contains({x: gameObject.position.x + gameObject.width, y: gameObject.position.y + gameObject.height})
		);
	};


	/**
		findTanks()
		@description Find all the tanks in the world.
	*/
	findTanks() {
		let tanks = [];
		for(var i = 0; i < this.objs.length; i++) {
			if(this.objs[i] instanceof Tank) {
				tanks.push(this.objs[i]);
			}
		}
		return tanks;
	};

	/**
		findPipes()
		@description Find all the pipes in the world.
	*/
	findPipes() {
		let pipes = [];
		for(var i = 0; i < this.objs.length; i++) {
			if(this.objs[i] instanceof Pipe) {
				pipes.push(this.objs[i]);
			}
		}
		return pipes;
	};


	/**
	 * get width()
	 * @description Gets the width of the world
	 */
	get width() {
		return this.rect.width + 20;
	};

	/**
	 * get height()
	 * @description Gets the height of the world
	*/
	get height() {
		return this.rect.height + 20;
	};
}
