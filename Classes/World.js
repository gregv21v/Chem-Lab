function World(position, width, height) {
	this.mouseObj = null; // the object centered on the mouse
	this.position = position;
	this.width = width;
	this.height = height;
	this.drops = [];
	this.objs = [];
	this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");


	var self = this;
	var mainSVG = document.querySelector("svg");
	mainSVG.addEventListener("mousedown", function(evnt) {
		// while the mouseObj is in the world, display it
		//if(self.within(this.mouseObj)) {
			
		//}

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



World.prototype.showTankSnapArea = function() {
	var tanks = this.findTanks();

	for(var i = 0; i < tanks.length; i++) {
		tanks[i].showSnapArea();
	}
};

World.prototype.hideTankSnapArea = function() {
	var tanks = this.findTanks();

	for(var i = 0; i < tanks.length; i++) {
		tanks[i].hideSnapArea();
	}
};
