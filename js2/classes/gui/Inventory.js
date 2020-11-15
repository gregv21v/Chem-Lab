/*

	Each "item" is a scale version of
	the original with a tooltip that mentions
	its actual dimensions and or properties


	TODO:
		add icons
		adjust text sizes
		make everything prettier



*/
class Inventory {
	constructor(player, position, width, height) {
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
			// add the item back into the inventory if the escape key is pressed
			// esc = 27
			if(evnt.keyCode == 27) {
				self.add(self.player.hand);
				self.player.hand = null;
			}
		});
	}


	/**
		createSlot()
		@description Create a new slot for the inventory
		@param i the index of the new slot
	*/
	createSlot(i) {
		var newSlot = new Slot(
			{
				x: this.rect.position.x,
				y: this.rect.position.y + i * this.slotHeight
			}, this.rect.width, 80)

		newSlot.setTextFill({color: "black"});
		newSlot.setFill({color: "blue", opacity: 0.5});
		newSlot.setName(this.objs[i].getName());
		newSlot.setDimensions(this.objs[i].getWidth(), this.objs[i].getHeight());
		//newSlot.setLiquidType(this.objs[i].getLiquidType());
		newSlot.setStroke({color: "black", width: 10});
		newSlot.index = i;

		newSlot.createSVG();

		return newSlot;
	};

	/**
		createSVG()
		@description create the SVG graphics for the inventory
	*/
	createSVG() {
		var self = this;

		var svg = document.querySelector("svg");
		this.rect.createSVG();

		// create the slots
		for(var i = 0; i < this.objs.length; i++) {
			this.slots.push(this.createSlot(i))
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

	getWidth() {
		return this.rect.width + 20;
	};

	getHeight() {
		return this.rect.height + 20;
	};

	add(item) {
		this.objs.push(item);
	};
	/*
		Picks an item from the inventory and places it in the players "hand" (followObj)
	*/
	pickItem() {

	};

	contains(point) {
		return this.rect.contains(point);
	};
}
