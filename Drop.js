/*
	LiquidDrop: falls until it reaches the bottom of a tank. At that point,
	it enters the tank.
*/
 var lastId = 0;

function Drop(world, position, size, fill)
{
	this.position = position;
	this.size = size;
	this.fill = fill;
	this.world = world;
	this.id = lastId;
	this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");

	lastId += 1;
}
/*
	Creates and adds the svg to the main svg object.
*/
Drop.prototype.createSVG = function() {
	var svg = document.querySelector("svg");

	this.updateSVG();

	svg.appendChild(this.svg);
};

/*
	Updates the svg after its already been added to the main svg object.
*/
Drop.prototype.updateSVG = function() {
	this.svg.setAttribute("width", this.size);
	this.svg.setAttribute("height", this.size);
	this.svg.setAttribute("x", this.position.x);
	this.svg.setAttribute("y", this.position.y);
	this.svg.setAttribute("fill", this.fill);
};

Drop.prototype.destroySVG = function() {
	this.svg.remove();
}

Drop.prototype.fall = function() {
	var self = this;

	var svg = document.querySelector("svg");

	this.position.y += 1;
	this.updateSVG();

	if(!this.world.within({position: this.position, width: this.size, height: this.size}))
	{
		this.world.removeDrop(this);
		this.destroySVG();
	} 
	else
	{
		// if in tank, remove drop and fill tank with size of drop
		this.world.objs.forEach(function(obj) {
			console.log(obj);

			if(obj instanceof Tank && obj.containsDrop(self))
			{

				obj.addLiquid(self.size * self.size);
				obj.updateLiquidSVG();

				// remove drop from world
				self.world.removeDrop(self);
				self.destroySVG();

				return;
			}
		})
	}
};
