/*
	The world contains all the game objects.
*/
import Pipe from "./world_objects/Pipe";
import Snappable from "./world_objects/Snappable";
import Rect from "./shapes/Rect";
import Tank from "./world_objects/tanks/Tank";
import { Distance } from "./shapes/Point"
import { getOpposite } from "./util";
import * as d3 from "d3"

export default class World {
	constructor(player, position, width, height) {
		this.player = player;
		this.snapSide = "";
		this.snappingTo = null;

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



		var mainSVG = document.querySelector("svg");
		var self = this;
		/*****************************************************
											 Mouse Interactions
		*****************************************************/
		/*
			Mouse Movement
		*/
		mainSVG.addEventListener('mousemove', function(evnt) {
			self.mouseMoveHandler(evnt);
		});

		/*
			Mouse Down
		*/
		mainSVG.addEventListener('mousedown', function(evnt) {
			self.mouseDownHandler(evnt);
		});


		/*****************************************************
									Keyboard Interactions
		*****************************************************/
		document.addEventListener('keypress', function(evnt) {
			// rotate the pipe in the players hand
			// 'r' = 114
			if(evnt.key == 'r' && self.player.hand instanceof Pipe) {
				self.player.hand.rotate();
				self.player.hand.updateSVG();
			}
		})
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
				var objCenter = this.objs[i].getCenter()
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
				let distance = Distance(obj.getCenter(), mousePos);
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
	createSVG() {
		this.rect.createSVG();

		// create svg's for all the in world objects except drops
		for(var i = 0; i < this.objs.length; i++)
			this.objs[i].createSVG();

		//for(var i = 0; i < this.objs.length; i++)
		//	this.objs[i].tooltip.createSVG();

	}


	/**
		add()
		@description Add an object (pump, tank... etc) to the world.
		@param obj the GameObject to add to the world
	*/
	add (obj) {
		this.objs.push(obj);

		// for debugging purposes
		var mainSVG = d3.select("body").select("svg")
		this.lines.push(mainSVG.append("line"))
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
		for(var i = 0; i < this.drops.length; i++)
		{
			this.drops[i].fall(this);
		}

		var pipes = this.findPipes();

		// Move fluid drops through pipes
		for(var pipe of pipes) {
			pipe.updateDrops();
		}

		for(var obj of this.objs) {
			if(obj instanceof Pipe || obj instanceof Tank)
				obj.transferLiquid();
		}

	};




	/**
		within()
		@description Check to see if a rectangler is entriely in the world
	*/
	within(rect) {
		// if all 4 corners of the rect are in the world
		return  (
				this.rect.contains({x: rect.position.x, y: rect.position.y}) && // top left
				this.rect.contains({x: rect.position.x + rect.width, y: rect.position.y}) && // top right
				this.rect.contains({x: rect.position.x, y: rect.position.y + rect.height}) && // bottom left
				this.rect.contains({x: rect.position.x + rect.width, y: rect.position.y + rect.height})
		);
	};


	/**
		findTanks()
		@description Find all the tanks in the world.
	*/
	findTanks() {
		var tanks = [];
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
		var pipes = [];
		for(var i = 0; i < this.objs.length; i++) {
			if(this.objs[i] instanceof Pipe) {
				pipes.push(this.objs[i]);
			}
		}
		return pipes;
	};


	/**
		getWidth()
		@description Get the width of the world
	*/
	getWidth () {
		return this.rect.width + 20;
	};

	/**
		getHeight()
		@description Get the height of the world
	*/
	getHeight () {
		return this.rect.height + 20;
	};
}
