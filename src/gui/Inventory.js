/*

	Inventory - where the players items are stored
	
	Each "item" is a scale version of
	the original with a tooltip that mentions
	its actual dimensions and or properties


	TODO:
		add icons
		adjust text sizes
		make everything prettier

*/
import Slot from "./Slot";
import Rect from "../shapes/Rect";

export default class Inventory {


	/**
	 * constructor()
	 * @description constructs the inventory
	 * @param {Player} player the player the inventory belongs to
	 * @param {Point} position the position of the inventory
	 * @param {Number} width the width of the inventory
	 * @param {Number} height the height of the inventory
	 */
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
	}


	/**
	 * onKeyPress() 
	 * @description called when a key is pressed.
	 */
	onKeyPress(event) {
		if(event.key === "Escape") { // not currently working
			this.add(this.player.hand);
			this.updateSVG()
			this.player.hand.destroySVG()

			this.player.hand = null;
		}
	}


	/**
		createSlot()
		@description Create a new slot for the inventory
		@param {Number} index the index of the new slot
	*/
	createSlot(index) {
		let newSlot = new Slot(this, index, this.rect.width, 80)
		newSlot.setTextFill({color: "black"});
		newSlot.setFill({color: "blue", opacity: 0.5});
		newSlot.setName(this.objs[index].getName());
		newSlot.setDimensions(this.objs[index].getWidth(), this.objs[index].getHeight());
		//newSlot.setLiquidType(this.objs[i].getLiquidType());
		newSlot.setStroke({color: "black", width: 10});
		newSlot.index = index;

		return newSlot;
	};

	/**
		createSVG()
		@description create the SVG graphics for the inventory
	*/
	createSVG() {
		this.rect.createSVG();

		for (const slot of this.slots) {
			slot.createSVG()
		}
	}

	

	/**
	 * updateSVG() 
	 * @description updates the svg for this inventory
	 */
	updateSVG() {
		
	}

	/**
	 * remove()
	 * @description removes an item by index from the inventory
	 * @param {Number} index the index of the item to remove
	 */
	remove(index) {
		// remove the object from the inventory
		this.objs.splice(index, 1);

		// remove the button
		this.slots[index].destroySVG();
		this.slots.splice(index, 1);

		// resign indicies
		for(var i = 0; i < this.slots.length; i++) {
			this.slots[i].index = i;
		}

		// update the graphics
		

	}

	getWidth() {
		return this.rect.width + 20;
	}

	getHeight() {
		return this.rect.height + 20;
	}

	/**
	 * add()
	 * @description adds the specifed item to the inventory
	 * @param {Item} item add the item to the inventory
	 */
	add(item) {
		this.objs.push(item);

		let newSlot = this.createSlot(this.slots.length);
		this.slots.push(newSlot)
		newSlot.createSVG();
	}

	/**
	 * pickItem()
	 * @description Picks an item from the inventory and places it in the players "hand" (followObj)
	 * @param {Number} index the index of the item to pick
	 */
	pickItem(index) {
		// put the item in the players hand
		this.player.hand = this.objs[index];
		this.player.hand.createSVG();

		this.remove(index);
	}

	contains(point) {
		return this.rect.contains(point);
	}
}
