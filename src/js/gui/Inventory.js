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
import ScrollableContainer from "./ScrollableContainer";

export default class Inventory extends ScrollableContainer {


	/**
	 * constructor()
	 * @description constructs the inventory
	 * @param {Player} player the player the inventory belongs to
	 * @param {Point} position the position of the inventory
	 * @param {Number} width the width of the inventory
	 * @param {Number} height the height of the inventory
	 */
	constructor(layer, player, position, width, height) {
		super(layer, position, width, height)

		this.player = player; // the player the inventory belongs to 
		this.slotHeight = 100; // the height of the slots 

		this.objs = []; // the GameObjects in the inventory
		this.slots = []; // the Slots that the GameObjects fit in
	}


	/**
	 * create() 
	 * @description creates the graphics
	 */
	create() {
		super.create();

		
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
			this.player.hand.destroy()
			this.player.hand = null;
		}
	}


	/**
		createSlot()
		@description Create a new slot for the inventory
		@param {Number} index the index of the new slot
	*/
	createSlot(index) {
		let newSlot = new Slot(this._content, this, index, this._width, this.slotHeight)

		newSlot.create(); // creates the graphics for the slot

		// style the slot
		newSlot.styling = {
			textColor: "black",
			color: "blue",
			opacity: 0.5,
			strokeColor: "black",
			strokeWidth: 3
		}

		newSlot.item = this.objs[index];
		newSlot.name = this.objs[index].name;
		newSlot.setDimensions(this.objs[index].width, this.objs[index].height);
		newSlot.description = this.objs[index].description;
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

		this._contentHeight = this.slots.length * this.slotHeight;
        this.calculateScrollBarProperties();
	}

	/**
	 * pickItem()
	 * @description Picks an item from the inventory and places it in the players "hand" (followObj)
	 * @param {Number} index the index of the item to pick
	 */
	pickItem(index) {
		// put the item in the players hand
		this.player.hand = this.objs[index];
		this.player.hand.create();

		this.remove(index);
	}

	/**
     * drag() 
     * @description drag the container
     * @param {Pointer} pointer the pointer that started the drag
     * @param {GameObject} gameObject the object that is being dragged
     * @param {Number} dragX the x position of the drag
     * @param {Number} dragY the y position of the drag
     */
    drag(event) {
        let newGripPosition = event.y;

        if (newGripPosition < 0) {
            newGripPosition = 0;
        }

        if (newGripPosition > this._trackScrollAreaSize) {
            newGripPosition = this._trackScrollAreaSize;
        }

        let newGripPositionRatio = newGripPosition / this._trackScrollAreaSize;
        this._grip.attr("y", this._position.y + newGripPosition)

        this._windowY = newGripPositionRatio * this._windowScrollAreaSize;

		// move all the content int the container
		for (const slot of this.slots) {
			slot.offsetY(this._position.y - this._windowY)	
		}

    }

	/**
	 * contains()
	 * @description checks whether the specifed point is contained within the inventory
	 * @param {Point} point the point to check for 
	 * @returns true if the point is contained within the rect 
	 * 			false otherwise
	 */
	contains (point) {
		return (
				(this._position.x <= point.x
				&& this._position.x + this._width >= point.x)
				&& (this._position.y <= point.y
				&& this._position.y + this._height >= point.y)
		);
	}

	/**
	 * get width()
	 * @description gets the width of the inventory
	 * @returns the width of the inventory
	 */
	get width() {
		return this._width + 20
	}

	/**
	 * get width()
	 * @description gets the width of the inventory
	 * @returns the width of the inventory
	 */
	get height() {
		return this._height + 20;
	}

	/**
	 * get position()
	 * @description gets the position of the inventory
	 * @returns the position of the inventory
	 */
	get position() {
		return this._position;
	}

}
