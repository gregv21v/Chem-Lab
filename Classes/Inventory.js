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
	this.rect = new Rect();
	this.rect.position = position;
	this.rect.width = width;
	this.rect.height = height;
	this.rect.stroke.width = 10;
	this.rect.stroke.color = "black";
	this.rect.fill.color = "blue";
	this.objs = [];
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
	this.rect.createSVG();


	// create the buttons
	for(var i = 0; i < this.objs.length; i++) {
		this.buttons.push(new Button({x: this.rect.position.x, y: this.rect.position.y + i * buttonHeight}, this.rect.width, 80));
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
	return this.rect.contains(point);
};
