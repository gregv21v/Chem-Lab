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
import * as d3 from "d3"

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
		this.player = player; // the player the inventory belongs to 
		this.slotHeight = 60; // the height of the slots 

		// a rect that borders the inventory
		this.rect = new Rect();
		this.rect.position = position;
		this.rect.width = width;
		this.rect.height = height;
		this.rect.stroke.width = 10;
		this.rect.stroke.color = "black";
		this.rect.fill.color = "blue";


		this.objs = []; // the GameObjects in the inventory
		this.slots = []; // the Slots that the GameObjects fit in
	}


	/**
	 * create() 
	 * @description creates the graphics
	 */
	create(parent) {
		this.rect.create(parent);
		this.rect.update()
	}

	



	/**
	 * destroy()
	 * @description destroys the svg for the button
	 */
	destroy() {

	}



	/**
	 * onKeyPress() 
	 * @description called when a key is pressed.
	 */
	onKeyPress(event) {
		if(event.key === "Escape") { 
			this.add(this.player.hand);
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
		let newSlot = new Slot(this, index, this.rect.width, this.slotHeight)

		newSlot.create(d3.select("svg")); // creates the graphics for the slot

		// style the slot
		newSlot.styling = {
			textColor: "black",
			color: "blue",
			opacity: 0.5,
			strokeColor: "black",
			strokeWidth: 5
		}

		newSlot.name = this.objs[index].name;
		newSlot.setDimensions(this.objs[index].width, this.objs[index].height);
		newSlot.index = index;

		return newSlot;
	};	


	/**
	 * remove()
	 * @description removes an item by index from the inventory
	 * @param {Number} index the index of the item to remove
	 */
	remove(index) {
		// remove the object from the inventory
		this.objs.splice(index, 1);

		// remove the button
		this.slots[index].destroy();
		this.slots.splice(index, 1);

		// resign indicies
		for(var i = 0; i < this.slots.length; i++) {
			this.slots[i].index = i;
		}
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
	}

	/**
	 * pickItem()
	 * @description Picks an item from the inventory and places it in the players "hand" (followObj)
	 * @param {Number} index the index of the item to pick
	 */
	pickItem(index) {
		// put the item in the players hand
		this.player.hand = this.objs[index];
		this.player.hand.createSVG(d3.select("svg"));

		this.remove(index);
	}

	/**
	 * contains()
	 * @description checks whether a point is contained within the inventory
	 * @param {Point} point the point to check for 
	 * @returns true if the point is contained within the inventory
	 */
	contains(point) {
		return this.rect.contains(point);
	}

	/**
	 * get width()
	 * @description gets the width of the inventory
	 * @returns the width of the inventory
	 */
	get width() {
		return this.rect.width + 20
	}

	/**
	 * get width()
	 * @description gets the width of the inventory
	 * @returns the width of the inventory
	 */
	get height() {
		return this.rect.height + 20;
	}

}
