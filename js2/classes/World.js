/*
	The world contains all the game objects.
*/
class World {
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
			if(evnt.keyCode == 114 && self.player.hand instanceof Pipe) {
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
			console.log(closestSnappable);
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









	/*
		Handles snapping of tanks to pipes.
	*/
	snapTank (tank, mousePos) {

		var pipes = this.findPipes();
		var snapping = false;

		for(var i = 0; i < pipes.length; i++) {
			// tanks in a snap area snap to the corresponding side of the tank
			if(pipes[i].snapAreas.first.intersects(tank.getRect())) {
				//console.log("Intersection first");
				this.snappingTo = pipes[i];
				snapping = this.snapTankAtAreaToPipe(pipes[i].snapAreas.first, pipes[i], tank, mousePos, "first")
			}
			if(pipes[i].snapAreas.second.intersects(tank.getRect())) {
				//console.log("Intersection second");
				this.snappingTo = pipes[i];
				snapping = this.snapTankAtAreaToPipe(pipes[i].snapAreas.second, pipes[i], tank, mousePos, "second")
			}
		}

		if(!snapping) {
			tank.centerAt(mousePos);
			tank.snapPosition = tank.position;
			tank.snapping = false;
		} else {
			console.log("Snapping");
			tank.snapping = true;
		}
		tank.updateSVG();

	};


	/*
		Snaps a tank to a snap area of a pipe.

		[]==========[]
	*/
	snapTankAtAreaToPipe (area, pipe, tank, mousePos, areaLabel) {
		if(pipe.alignment === "horizontal") {
			// which side of the tank is is the first snap area closest to
			var dx1 = area.position.x - tank.snapPosition.x; // distance from snap area to left tank wall
			var dx2 = area.position.x - (tank.snapPosition.x + tank.getWidth()); // distance from snap area to right tank wall

			if(dx1 < dx2) { // snap area is closer to **Left** tank wall
				//console.log("LEFT WALL");
				tank.snapPosition.x = pipe.center.x;
				tank.snapPosition.y = mousePos.y;

				// Pipe (snappingTo) is on the left.
				this.objectOn = "left";

				tank.snapping = true;
				return true;
			} else { // snap area is closer to **Right** tank wall
				//console.log("RIGHT WALL");
				if(areaLabel === "first") {
					tank.snapPosition.x = pipe.center.x - pipe.getWidth()/2 - tank.getWidth();
					tank.snapPosition.y = mousePos.y;

					// Pipe (snappingTo) is on the right.
					this.objectOn = "right";
				} else {
					tank.snapPosition.x = pipe.center.x + pipe.getWidth()/2;
					tank.snapPosition.y = mousePos.y;

					// Pipe (snappingTo) is on the right.
					this.objectOn = "left";
				}



				tank.snapping = true;
				return true;
			}
		} else {
			// which side of the tank is is the first snap area closest to
			var dy1 = area.position.y - tank.snapPosition.y; // distance from snap area to the top of the tank
			var dy2 = area.position.y - (tank.snapPosition.y + tank.getHeight()); // distance from snap area to bottom of the tank

			if(dy1 < dy2) { // snap area is closer to **Bottom** tank wall
				//console.log("BOTTOM WALL");
				tank.snapPosition.x = mousePos.x;
				tank.snapPosition.y = pipe.center.y - pipe.getWidth() - tank.getHeight();

				// Pipe (snappingTo) is on the bottom.
				this.objectOn = "down";

				tank.snapping = true;
				return true;
			}
		}
		return false;
	};
	/*
		There are 4 possible configurations
		to the snap areas of the pipe.

			Left - Right
			Right - Left

			Top - Bottom
			Bottom - Top

		Each configuration of the snap areas will
		effect differently where an object snapping
		to the pipe will go.

		[]==========[]
	*/
	determineSnapAreaOrientation (area, pipe, tank, mousePos, areaLabel) {
		if(pipe.alignment === "horizontal") {
			// which side of the tank is is the first snap area closest to
			var dx1 = area.position.x - tank.snapPosition.x; // distance from snap area to left tank wall
			var dx2 = area.position.x - (tank.snapPosition.x + tank.getWidth()); // distance from snap area to right tank wall

			if(dx1 < dx2) { // snap area is closer to **Left** tank wall
				//console.log("LEFT WALL");
				tank.snapPosition.x = pipe.center.x;
				tank.snapPosition.y = mousePos.y;

				// Pipe (snappingTo) is on the left.
				this.objectOn = "left";

				tank.snapping = true;
				return true;
			} else { // snap area is closer to **Right** tank wall
				//console.log("RIGHT WALL");
				if(areaLabel === "first") {
					tank.snapPosition.x = pipe.center.x - pipe.getWidth()/2 - tank.getWidth();
					tank.snapPosition.y = mousePos.y;

					// Pipe (snappingTo) is on the right.
					this.objectOn = "right";
				} else {
					tank.snapPosition.x = pipe.center.x + pipe.getWidth()/2;
					tank.snapPosition.y = mousePos.y;

					// Pipe (snappingTo) is on the right.
					this.objectOn = "left";
				}



				tank.snapping = true;
				return true;
			}
		} else {
			// which side of the tank is is the first snap area closest to
			var dy1 = area.position.y - tank.snapPosition.y; // distance from snap area to the top of the tank
			var dy2 = area.position.y - (tank.snapPosition.y + tank.getHeight()); // distance from snap area to bottom of the tank

			if(dy1 < dy2) { // snap area is closer to **Bottom** tank wall
				//console.log("BOTTOM WALL");
				tank.snapPosition.x = mousePos.x;
				tank.snapPosition.y = pipe.center.y - pipe.getWidth() - tank.getHeight();

				// Pipe (snappingTo) is on the bottom.
				this.objectOn = "down";

				tank.snapping = true;
				return true;
			}
		}
		return false;
	};


	/*
		Show the snap areas of all objects in the world.
	*/
	showSnapAreas() {
		for(var i = 0; i < this.objs.length; i++) {
			if(!(this.objs[i] instanceof Pump)) {
				this.objs[i].showSnapAreas();
			}
		}
	};


	/*
		Hide the snap areas of all objects in the world.
	*/
	hideSnapAreas() {
		for(var i = 0; i < this.objs.length; i++) {
			if(!(this.objs[i] instanceof Pump)) {
				this.objs[i].hideSnapAreas();
			}
		}
	};

}
