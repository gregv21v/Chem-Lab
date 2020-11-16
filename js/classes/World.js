/*
	The world contains all the game objects.
*/
function World(player, position, width, height) {
	this.player = player;
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

	var mainSVG = document.querySelector("svg");
	var self = this;
	/*****************************************************
								     Mouse Interactions
	*****************************************************/
	/*
		Mouse Movement
	*/
	mainSVG.addEventListener('mousemove', function(evnt) {
		var mousePos = {x: evnt.clientX, y: evnt.clientY};

    if(self.player.hand != null) {

      // snap following pipe to tank if pipe is within the tanks snapping radius
			for(var obj of self.objs) {
				var side = self.player.hand.snapTo(obj, mousePos);
				console.log(side);
				if(side === "") {
					self.player.hand.center = mousePos
				}
				self.player.hand.updateSVG()
			}
    }
  });

	/*
		Mouse Down
	*/
	mainSVG.addEventListener('mousedown', function(evnt) {

		// place the object in the world
		// when you are not in the inventory, and have selected a button
		if(self.player.hand != null &&
			!self.player.inventory.contains({x: evnt.clientX, y: evnt.clientY}))
		{
			//self.player.hand.updateTooltip();
			//console.log(self.player.hand);
			//console.log(self.snappingTo);
			// Move the object to the world
			if(self.player.hand) {
				if(self.snappingTo) {
					self.player.hand.attachTo(self.snappingTo, self.objectOn);
					self.snappingTo.attachTo(self.player.hand, getOpposite(self.objectOn));
				}
				self.add(self.player.hand);
				if(self.player.hand instanceof Pipe) {
					self.player.hand.center = self.player.hand.snapCenter;
				}
				self.player.hand = null;
				self.snappingTo = null;
				self.objectOn = "";
			}

		}
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


/*
	Create the SVG for the tank.
*/
World.prototype.createSVG = function() {
	this.rect.createSVG();

	// create svg's for all the in world objects except drops
	for(var i = 0; i < this.objs.length; i++)
		this.objs[i].createSVG();

	//for(var i = 0; i < this.objs.length; i++)
	//	this.objs[i].tooltip.createSVG();

}


/*
	Add an object (pump, tank... etc) to the world.
*/
World.prototype.add = function (obj) {
	this.objs.push(obj);
};

World.prototype.addDrop = function (drop) {
	this.drops.push(drop);
};

/*
	Remove a given drop of liquid from the world.
	Used for adding liquid drops to a tank.
*/
World.prototype.removeDrop = function(drop) {
	this.drops = this.drops.filter(function(obj) {
		return obj.id != drop.id;
	});
};
/*
	Update the liquid drops that are currently in the
	world.
*/
World.prototype.update = function() {
	for(var i = 0; i < this.drops.length; i++)
	{
		this.drops[i].fall(this);
	}

	var tanks = this.findTanks();
	var pipes = this.findPipes();

	// Move fluid drops through pipes
	for(var x in pipes) {
		pipes[x].updateDrops();
	}

	// TODO: ====> this
	for(var x in tanks) {
		var tank = tanks[x];
		for(var y in tank.connectedPipes) {
			var pipe = tank.connectedPipes[y].pipe;
			var side = tank.connectedPipes[y].side;


			// drops enter pipe.
			if(true /* side === "right" || side === "down" */) {
				// only get the drop if the pipe is at or
				// below the tanks liquid level.
				var drop;
				if (tank.pipeCanAccessLiquid(pipe)) {
					drop = tank.getDrop(pipe.getDropSize());
				} else {
					drop = null;
				}
				if(drop) {
					if(side === "left") {
						drop.position = {
							x: pipe.position.x + pipe.getWidth() - drop.size/2,
							y: pipe.center.y - drop.size/2
						}
					} else if(side === "right") {
						drop.position = {
							x: pipe.position.x,
							y: pipe.center.y - drop.size/2
						}
					} else if(side === "up") {
						drop.position = {
							x: pipe.position.x + drop.size/2,
							y: pipe.position.y
						}
					} else if(side === "down") {
						drop.position = {
							x: pipe.position.x + drop.size/2,
							y: pipe.position.y
						}
					}
					drop.createSVG();
					pipe.addDrop(drop, side);
				}
			}


			// drops exit pipe
			var otherTank = null;
			for(var z in pipe.connectedTanks) {
				if(pipe.connectedTanks[z].side === side) {
					otherTank = pipe.connectedTanks[z].tank;
				}
			}

			if(otherTank) {
				var drops = pipe.spout();
				for(var z in drops) {
					if(!otherTank.addDrop(drops[z].drop)) {
						pipe.addDropBack(drops[z]);
					} else {
						drops[z].drop.destroySVG();
						otherTank.updateLiquidSVG();
					}
				}
			}
		}
	}


};




/*
	Check to see if a rectangler {position, width, height} object is within the world
*/
World.prototype.within = function(rect) {
	// if all 4 corners of the rect are in the world
	return  (
			this.rect.contains({x: rect.position.x, y: rect.position.y}) && // top left
			this.rect.contains({x: rect.position.x + rect.width, y: rect.position.y}) && // top right
			this.rect.contains({x: rect.position.x, y: rect.position.y + rect.height}) && // bottom left
			this.rect.contains({x: rect.position.x + rect.width, y: rect.position.y + rect.height})
	);
};


/*
	Find all the tanks in the world.
*/
World.prototype.findTanks = function() {
	var tanks = [];
	for(var i = 0; i < this.objs.length; i++) {
		if(this.objs[i] instanceof Tank) {
			tanks.push(this.objs[i]);
		}
	}
	return tanks;
};

World.prototype.getWidth = function () {
	return this.rect.width + 20;
};

World.prototype.getHeight = function () {
	return this.rect.height + 20;
};

/*
	Find all the pipes in the world.
*/
World.prototype.findPipes = function() {
	var pipes = [];
	for(var i = 0; i < this.objs.length; i++) {
		if(this.objs[i] instanceof Pipe) {
			pipes.push(this.objs[i]);
		}
	}
	return pipes;
};

/*
	Handles snapping of pipes to tanks.
*/
World.prototype.snapPipe = function (pipe, mousePos) {

	var tanks = this.findTanks();
	var snapping = false
	pipe.center = mousePos;

	// find an object to snap to
	for(var i = 0; i < tanks.length; i++) {
		var side = pipe.snapTo(tanks[i])
		if(side !== "") {
			this.objectOn = side;
			this.snappingTo = tanks[i];
			snapping = true;
		}
	}

	if (!snapping) {
		// the object is no longer snapping, so place it
		// where it belongs.
		pipe.center = mousePos
		pipe.snapCenter = pipe.center;
		pipe.snapping = false;
	} else {
		// the object is snapping again
		pipe.snapping = true;
	}

	pipe.updatePosition();
	pipe.updateSVG();
};

World.prototype.snapValve = function (valve, mousePos) {

	var snapping = false;


	for(var i = 0; i < pipes.length; i++) {
		// check to see if the pipe and valve intersect.
		if(valve.getRect().intersects(pipes[i].getRect())) {
			// axis align them
			console.log("intersects");

			valve.position.y = pipes[i].center.y;
			snapping = true;
		}
	}

	if(!snapping) {
		valve.center = mousePos
		valve.snapCenter = valve.center;
		valve.snapping = false;
	} else {
		valve.snapping = true;
	}

	//valve.updatePosition();
	valve.updateSVG();
};



/*
	Handles snapping of tanks to pipes.
*/
World.prototype.snapTank = function (tank, mousePos) {

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
World.prototype.snapTankAtAreaToPipe = function (area, pipe, tank, mousePos, areaLabel) {
	if(pipe.alignment === "horizontal") {
		// which side of the tank is the first snap area closest to
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
World.prototype.determineSnapAreaOrientation = function (area, pipe, tank, mousePos, areaLabel) {
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
World.prototype.showSnapAreas = function() {
	for(var i = 0; i < this.objs.length; i++) {
		if(!(this.objs[i] instanceof Pump)) {
			this.objs[i].showSnapAreas();
		}
	}
};


/*
	Hide the snap areas of all objects in the world.
*/
World.prototype.hideSnapAreas = function() {
	for(var i = 0; i < this.objs.length; i++) {
		if(!(this.objs[i] instanceof Pump)) {
			this.objs[i].hideSnapAreas();
		}
	}
};
