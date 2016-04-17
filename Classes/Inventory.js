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
	this.slots = 3;
	this.slotHeight = 80;
	this.rect = new Rect();
	this.rect.position = position;
	this.rect.width = width;
	this.rect.height = height;
	this.rect.stroke.width = 10;
	this.rect.stroke.color = "black";
	this.rect.fill.color = "blue";
	this.objs = [];
	this.slots = [];

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


	var svg = document.querySelector("svg");
	this.rect.createSVG();


	// create the slots
	for(var i = 0; i < this.objs.length; i++) {
		this.slots.push(new Slot({x: this.rect.position.x, y: this.rect.position.y + i * this.slotHeight}, this.rect.width, 80));
		this.slots[i].setTextFill({color: "black"});
		this.slots[i].setFill({color: "blue", opacity: 0.5});
		this.slots[i].setText(this.objs[i].getInfo());
		this.slots[i].setStroke({color: "black", width: 10});
		this.slots[i].index = i;

		this.slots[i].createSVG();
		this.slots[i].setOnClickWithParam(function(button) {
			// move the object to the player's hand

			// pickup item
			self.player.hand = self.objs[button.index];
			self.player.hand.createSVG();

			// remove the object from the inventory
			self.objs.splice(button.index, 1);

			// remove the button
			button.destroySVG();
			self.slots.splice(button.index, 1);

			// resign indicies
			for(var i = 0; i < self.slots.length; i++) {
				self.slots[i].index = i;
			}

		}, this.slots[i]);
	}
};

Inventory.prototype.getWidth = function () {
	return this.rect.width + 20;
};

Inventory.prototype.getHeight = function () {
	return this.rect.height + 20;
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
