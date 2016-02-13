function World(player, position, width, height) {
	this.player = player;
	this.mouseObj = null; // the object centered on the mouse
	this.position = position;
	this.width = width;
	this.height = height;
	this.drops = [];
	this.objs = [];
	this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");


	var self = this;
	var mainSVG = document.querySelector("svg");


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
      if(self.player.hand instanceof Pipe) {
				self.snapPipe(self.player.hand, mousePos);
      } else if(self.player.hand instanceof Tank) {
				self.snapTank(self.player.hand, mousePos);
			}
    }
  });

	/*
		Mouse Down
	*/
	mainSVG.addEventListener('mousedown', function(evnt) {
		// place the object in the world
		// when you are not in the inventory, and have selected a button
		if(!self.player.inventory.contains({x: evnt.clientX, y: evnt.clientY}))
		{
			// move the object to the world
			self.add(self.player.hand);
			if(self.player.hand instanceof Pipe) {
				self.player.hand.center = self.player.hand.snapCenter;
			}
			self.player.hand = null;

		}
	});


	/*****************************************************
								Keyboard Interactions
	*****************************************************/
	document.addEventListener('keypress', function(evnt) {
		// rotate the pipe in the players hand
		// r = 114
		if(evnt.keyCode == 114 && self.player.hand instanceof Pipe) {
			self.player.hand.rotate();
			self.player.hand.updateSVG();
		}
	})
}

World.prototype.createSVG = function() {
	var svgMain = document.querySelector("svg");

	this.svg.setAttribute("x", this.position.x);
	this.svg.setAttribute("y", this.position.y);
	this.svg.setAttribute("width", this.width);
	this.svg.setAttribute("height", this.height);
	this.svg.setAttribute("stroke-width", 10);
	this.svg.setAttribute("stroke", "black");
	this.svg.setAttribute("fill", "white");


	svgMain.appendChild(this.svg);

	// create svg's for all the in world objects except drops
	for(var i = 0; i < this.objs.length; i++)
		this.objs[i].createSVG();

}

World.prototype.add = function (obj) {
	if(!(obj instanceof Pump)) {
		obj.updateSnapAreas();
		obj.showSnapAreas();
	}
	this.objs.push(obj);
};

World.prototype.update = function() {
	for(var i = 0; i < this.drops.length; i++)
	{
		this.drops[i].fall();
	}
};

World.prototype.removeDrop = function(drop) {
	this.drops = this.drops.filter(function(obj) {
		return obj.id != drop.id;
	});
};

/*
	Check to see if a rectangler {position, width, height} object is within the world

*/
// Swap from job search to game development, every other day.

World.prototype.within = function(rect) {
	// if all 4 corners of the rect are in the world
	return  (
			   ( // top left
					   this.position.x <= rect.position.x
					&& this.position.x + this.width >= rect.position.x
					&& this.position.y <= rect.position.y
					&& this.position.y + this.height >= rect.position.y
			   ) &&
			   ( // top right
					   this.position.x <= rect.position.x + rect.width
					&& this.position.x + this.width >= rect.position.x + rect.width
					&& this.position.y <= rect.position.y
					&& this.position.y + this.height >= rect.position.y
			   ) &&
			   ( // bottom left
					   this.position.x <= rect.position.x
					&& this.position.x + this.width >= rect.position.x
					&& this.position.y <= rect.position.y + rect.height
					&& this.position.y + this.height >= rect.position.y + rect.height
			   ) &&
			   ( // bottom right
					   this.position.x <= rect.position.x + rect.width
					&& this.position.x + this.width >= rect.position.x + rect.width
					&& this.position.y <= rect.position.y + rect.height
					&& this.position.y + this.height >= rect.position.y + rect.height
			   )
			);
};



World.prototype.findTanks = function() {
	var tanks = [];
	for(var i = 0; i < this.objs.length; i++) {
		if(this.objs[i] instanceof Tank) {
			tanks.push(this.objs[i]);
		}
	}
	return tanks;
};

World.prototype.findPipes = function() {
	var pipes = [];
	for(var i = 0; i < this.objs.length; i++) {
		if(this.objs[i] instanceof Pipe) {
			pipes.push(this.objs[i]);
		}
	}
	return pipes;
};

World.prototype.snapPipe = function (pipe, mousePos) {

	var tanks = this.findTanks();
	var snapping = false
	pipe.center = mousePos;

	for(var i = 0; i < tanks.length; i++) {
		//console.log("In Snap Pipe");

		/*
			Left snapping region check.
		*/
		if(tanks[i].snapAreas.left.intersects(pipe.getRect())) {
			snapping = true;
			pipe.setAlignment("horizontal");

			// set the snapping position to the left edge of the
			// tank closes to the pipe.
			pipe.snapCenter.x = tanks[i].position.x	- pipe.getWidth()/2;
			pipe.snapCenter.y = pipe.center.y;
		}

		/*
			Right snapping region check.
		*/
		if(tanks[i].snapAreas.right.intersects(pipe.getRect())) {
			snapping = true;
			pipe.setAlignment("horizontal");


			// set the snapping position to the right edge of the
			// tank closes to the pipe.
			pipe.snapCenter.x = tanks[i].position.x + tanks[i].getWidth()	+ pipe.getWidth()/2;
			pipe.snapCenter.y = pipe.center.y;
		}

		/*
			Bottom snapping region check.
		*/
		if(tanks[i].snapAreas.bottom.intersects(pipe.getRect())) {
			snapping = true;
			pipe.setAlignment("vertical");

			// set the snapping position to the bottom edge of the
			// tank closes to the pipe.
			pipe.snapCenter.x = pipe.center.x;
			pipe.snapCenter.y = tanks[i].position.y + tanks[i].getHeight() + pipe.getHeight()/2;
		}
	}
	if (!snapping) {
		//console.log("Not Snapping");
		pipe.center = mousePos
		pipe.snapCenter = pipe.center;
		pipe.snapping = false;
	} else {
		//console.log("Snapping");
		pipe.snapping = true;
	}

	pipe.updatePosition();
	pipe.updateSVG();
};

World.prototype.snapTank = function (tank, mousePos) {

	var pipes = this.findPipes();
	var snapping = false;

	for(var i = 0; i < pipes.length; i++) {
		
		// tanks in a snap area snap to the corresponding side of the tank


		if(pipes[i].snapAreas.first.intersects(tank.getRect())) {
			console.log("Intersection first");
			snapping = this.snapTankAtAreaToPipe(pipes[i].snapAreas.first, pipes[i], tank, mousePos)
		}
		if(pipes[i].snapAreas.second.intersects(tank.getRect())) {
			console.log("Intersection second");
			snapping = this.snapTankAtAreaToPipe(pipes[i].snapAreas.second, pipes[i], tank, mousePos)
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
World.prototype.snapTankAtAreaToPipe = function (area, pipe, tank, mousePos) {
	if(pipe.alignment == "horizontal") {
		// which side of the tank is is the first snap area closest to
		var dx1 = area.position.x - tank.snapPosition.x; // distance from snap area to left tank wall
		var dx2 = area.position.x - (tank.snapPosition.x + tank.getWidth()); // distance from snap area to right tank wall

		if(dx1 < dx2) { // snap area is closer to **left** tank wall
			console.log("LEFT WALL");
			tank.snapPosition.x = pipe.center.x;
			tank.snapPosition.y = mousePos.y;

			tank.snapping = true;
			return true;
		} else { // snap area is closer to **right** tank wall
			console.log("RIGHT WALL");
			tank.snapPosition.x = pipe.center.x + pipe.getWidth()/2;
			tank.snapPosition.y = mousePos.y;

			tank.snapping = true;
			return true;
		}
	} else {
		// which side of the tank is is the first snap area closest to
		var dy1 = area.position.y - tank.snapPosition.y; // distance from snap area to the top of the tank
		var dy2 = area.position.y - (tank.snapPosition.y + tank.getHeight()); // distance from snap area to bottom of the tank

		if(dy1 < dy2) { // snap area is closer to bottom tank wall
			console.log("BOTTOM WALL");
			tank.snapPosition.x = mousePos.x;
			tank.snapPosition.y = pipe.center.y - pipe.getWidth() - tank.getHeight();

			tank.snapping = true;
			return true;
		}
	}
	return false;
};


World.prototype.showSnapAreas = function() {
	for(var i = 0; i < this.objs.length; i++) {
		if(!(this.objs[i] instanceof Pump)) {
			this.objs[i].showSnapAreas();
		}
	}
};

World.prototype.hideSnapAreas = function() {
	for(var i = 0; i < this.objs.length; i++) {
		if(!(this.objs[i] instanceof Pump)) {
			this.objs[i].hideSnapAreas();
		}
	}
};
