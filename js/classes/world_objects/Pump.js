/*
	Pump: every time you click the pump, a drop of liquid is
	produced. Liquid always comes from the bottom of the pump.

	Alternatively, if an engine is attached to the pump, it will pump
	fluid out automatically.




	extra:
		make it so button bubbles in and out when clicked

*/


function Pump(world, position, production)
{

	GameObject.call(this, position)

	this.production = production;
	this.position = position;
	this.svg = {
		spout: document.createElementNS("http://www.w3.org/2000/svg", "rect"), // where the liquid comes out
		button: document.createElementNS("http://www.w3.org/2000/svg", "circle") // pressed to get liquid
	}

	var self = this;
	this.svg.button.onclick = function() {
		self.produceDrop(world)
	}
}

Pump.prototype = Object.create(GameObject.prototype);
Pump.prototype.constructor = Pump;


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

	this.svg.spout.setAttribute("width", this.production);
	this.svg.spout.setAttribute("height", this.production * 2);
	this.svg.spout.setAttribute("x", this.position.x - this.production/2);
	this.svg.spout.setAttribute("y", this.position.y + this.production);
}


/*
	Creates a drop of liquid upon clicking the pump.
*/
Pump.prototype.produceDrop = function(world) {
	var possibleLiquids = [
		new Liquid(1, {red: 50, green: 0, blue: 100}),
		new Liquid(3, {red: 0, green: 75, blue: 100}),
		new Liquid(5, {red: 10, green: 100, blue: 100}),
		new Liquid(100, {red: 255, green: 0, blue: 0})
	];



	var drop = new Drop(
			{x: this.position.x - this.production/2, y: this.position.y + this.production * 3},
			this.production,
			possibleLiquids[getRandomInt(0, possibleLiquids.length)]
	  )
	drop.createSVG();
	world.addDrop(drop);
};

Pump.prototype.getWidth = function () {
	return this.production * 4;
};


Pump.prototype.getHeight = function () {
	return this.production * 4;
};

/*
	A info used for creating a tooltip
*/
Pump.prototype.getName = function() {
	return this.production;
};

Pump.prototype.getLiquidType = function () {
	return "Water";
};
