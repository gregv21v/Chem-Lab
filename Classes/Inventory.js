/*
	Each "item" is a scale version of
	the original with a tooltip that mentions
	its actual dimensions and or properties


	TODO:
		add icons
		adjust text sizes
		make everything prettier

*/


function Inventory(player, position, width, height)
{
	this.player = player;
	this.position = position;
	this.objs = [];
	this.width = width;
	this.height = height;
	this.buttons = [];

	var self = this;

	document.addEventListener('keypress', function(evnt) {
		// add the item back into the inventory
		// esc = 27
		if(evnt.keyCode == 27) {
			self.add(self.player.hand);
		}
	});

}
Inventory.prototype.createSVG = function() {
	var self = this;
	var buttonHeight = 80;


	var svg = document.querySelector("svg");

	var background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	background.setAttribute("height", this.height);
	background.setAttribute("width", this.width);
	background.setAttribute("x", this.position.x);
	background.setAttribute("y", this.position.y);
	background.setAttribute("stroke-width", 10);
	background.setAttribute("fill", "blue");
	background.setAttribute("stroke", "black");

	svg.appendChild(background);

	// create the buttons
	for(var i = 0; i < this.objs.length; i++) {
		this.buttons.push(new Button({x: this.position.x, y: this.position.y + i * buttonHeight}, this.width, 80));
		this.buttons[i].setTextFill({color: "black"});
		this.buttons[i].setFill({color: "blue", opacity: 0.5});
		this.buttons[i].setText(this.objs[i].getInfo());
		this.buttons[i].setStroke({color: "black", width: 10});
		this.buttons[i].index = i;

		this.buttons[i].createSVG();
		this.buttons[i].setOnClickWithParam(function(button) {
			// move the object to the player's hand

			// pickup item
			self.player.hand = self.objs[button.index];
			self.player.hand.createSVG();

			// remove the object from the inventory
			self.objs.splice(button.index, 1);

			// remove the button
			button.destroySVG();
			self.buttons.splice(button.index, 1);

			// resign indicies
			for(var i = 0; i < self.buttons.length; i++) {
				self.buttons[i].index = i;
			}

		}, this.buttons[i]);
	}
};

Inventory.prototype.add = function (item) {
	this.objs.push(item);
};
/*
	Picks an item from the inventory and places it in the players "hand" (followObj)
*/
Inventory.prototype.pickItem = function () {

};

Inventory.prototype.contains = function(point) {
	return point.x <= this.position.x + this.width
		&& point.x >= this.position.x
		&& point.y <= this.position.y + this.height
		&& point.y >= this.position.y;
};
