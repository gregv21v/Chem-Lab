/*
	The world contains all the game objects.
*/
import Pipe from "./world_objects/pipes/Pipe";
import Snappable from "./world_objects/Snappable";
import Rect from "./shapes/Rect";
import Tank from "./world_objects/tanks/Tank";
import { Distance } from "./shapes/Point"
import { getOpposite } from "./util";
import * as d3 from "d3"
import GameObject from "./world_objects/GameObject";

export default class World {
	constructor(player, position, width, height) {
		this.player = player;
		this.snapSide = "";
		this.snappingTo = null;
		this._position = position;

		// The side that the given object (snappingTo) is on.
		this.objectOn = ""
		this.mouseObj = null; // the object centered on the mouse
		this.rect = new Rect();
		this.rect.position = position;
		this.rect.width = width;
		this.rect.height = height;
		this.rect.stroke.width = 10;
		this.rect.stroke.color = "black";
		this.drops = [];
		this.objs = [];
		this.lines = []



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
		if(this.player.hand != null &&
			!this.player.inventory.contains({x: evnt.clientX, y: evnt.clientY}))
		{
			//this.player.hand.updateTooltip();
			//console.log(this.player.hand);
			//console.log(this.snappingTo);
			// Move the object to the world
			if(this.player.hand) {
				if(this.snappingTo) {
					this.player.hand.attachTo(this.snappingTo, getOpposite(this.snapSide));
					this.snappingTo.attachTo(this.player.hand, this.snapSide);
				}
				this.add(this.player.hand);
				this.player.hand = null; // empty hand
				this.snappingTo = null;
				this.snapSide = "";
			}

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

			for (var i = 0; i < this.lines.length; i++) {
				var objCenter = this.objs[i].center
				this.lines[i]
					.style("stroke", "orange")
					.attr("x1", objCenter.x)
					.attr("y1", objCenter.y)
					.attr("x2", mousePos.x)
					.attr("y2", mousePos.y)
			}


			this.player.hand.moveRelativeToCenter(mousePos)
			let closestSnappable = this.findClosestSnappable(mousePos)
			//console.log(closestSnappable);
			if(closestSnappable != null) {
				this.snapSide = this.player.hand.snapTo(closestSnappable, mousePos);
				if(this.snapSide !== "")
					this.snappingTo = closestSnappable;
			}
			this.player.hand.updateSVG()
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
		let closestDistance = 100000
		for(var obj of this.objs) {
			if(obj instanceof Snappable) {
				let distance = Distance(obj.center, mousePos);
				if(distance < closestDistance) {
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
		this.rect.create(d3.select("svg"));
		this.rect.update()
	}


	/**
		add()
		@description Add an object (pump, tank... etc) to the world.
		@param obj the GameObject to add to the world
	*/
	add (obj) {
		this.objs.push(obj);

		obj.createSVG(d3.select("svg"));

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

		let pipes = this.findPipes();

		// Move fluid drops through pipes
		for(const pipe of pipes) {
			pipe.updateDrops();
		}

		for(const obj of this.objs) {
			if(obj instanceof Pipe || obj instanceof Tank)
				obj.transferLiquid();
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


	/**
	 * get position()
	 * @description get the position of the world
	 */
	get position() {
		return this._position;
	}
}
