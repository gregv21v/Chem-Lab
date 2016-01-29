/*
	Pump: every time you click the pump, a drop of liquid is 
	produced. Liquid always comes from the bottom of the pump.

	Alternatively, if an engine is attached to the pump, it will pump 
	fluid out automatically.

	


	extra:
		make it so button bubbles in and out when clicked

*/



/*
	Creates the pumps data
*/
function Pump(world, position, production)
{
	this.production = production;
	this.position = position;
	this.world = world;
	this.svg = {
		spout: document.createElementNS("http://www.w3.org/2000/svg", "rect"), // where the liquid comes out
		button: document.createElementNS("http://www.w3.org/2000/svg", "circle") // pressed to get liquid
	}
}


Pump.prototype.createSVG = function() {
	var SVGMain = document.querySelector("svg");

	this.updateSVG();

	SVGMain.appendChild(this.svg.spout);
	SVGMain.appendChild(this.svg.button);
};

Pump.prototype.updateSVG = function() {
	var self = this;

	this.svg.button.setAttribute("r", this.production * 2);
	this.svg.button.setAttribute("cx", this.position.x);
	this.svg.button.setAttribute("cy", this.position.y);
	this.svg.button.setAttribute("fill", "red");
	this.svg.button.onclick = function() {
		self.world.drops.push(self.click());
	}

	this.svg.spout.setAttribute("width", this.production);
	this.svg.spout.setAttribute("height", this.production * 2);
	this.svg.spout.setAttribute("x", this.position.x - this.production/2);
	this.svg.spout.setAttribute("y", this.position.y + this.production);
}

Pump.prototype.click = function() {
	var drop = new Drop(
					this.world,
					{x: this.position.x - this.production/2, y: this.position.y + this.production * 3}, 
					this.production, 
					"blue"
			   );
	drop.createSVG();

	return drop;
};


/*
	A string of info used for creating a tooltip
*/
Pump.prototype.getInfo = function() {
	return this.production;
};

Pump.prototype.createIcon = function() {
	
}


