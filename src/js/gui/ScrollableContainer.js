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
import * as d3 from "d3"

export default class ScrollableContainer {

    static minimalGripSize = 20;


	/**
	 * constructor()
	 * @description constructs the inventory
	 * @param {Point} position the position of the inventory
	 * @param {Number} width the width of the inventory
	 * @param {Number} height the height of the inventory
	 */
	constructor(layer, position, width, height) {
        this._layer = layer;
		this._position = position; // the position of the inventory
        this._width = width; // the width of the inventory
        this._height = height; // the height of the inventory
        this._contentHeight = 0;
        this._trackSize = height;
        this._windowY = 0;

        this.calculateScrollBarProperties();
	}


    /** 
     * calculateScrollBarProperties()
     * @description Calculates the scrollbar properties
     */
    calculateScrollBarProperties() {
        this._windowContentRatio = this._height / this._contentHeight;
        this._gripSize = this._trackSize * this._windowContentRatio;

        //The minimal size of our grip
        let minimalGripSize = 20;

        //If the grip is too small, set it so that it is at our
        //predetermined minimal size!
        if (this._gripSize < minimalGripSize) {
            this._gripSize = minimalGripSize;
        }

        //The minimal size of our grip
        let maximumGripSize = 50;
         
        //If the grip is too small, set it so that it is at our
        //predetermined minimal size!
        if (this._gripSize > maximumGripSize) {
            this._gripSize = maximumGripSize;
        }

        this._windowScrollAreaSize = this._contentHeight - this._height; 
        this._windowPositionRatio = this._windowY / this._windowScrollAreaSize;
        this._trackScrollAreaSize = this._trackSize - this._gripSize
        this._gripPositionOnTrack = this._trackScrollAreaSize * this._windowPositionRatio
    }


    /**
     * addContent()
     * @description adds content to the container
     * @param {GameObject} content the content to add
     */
    addContent(content) {
        this._content.add(content);

        // calculate the content height by content with the lowest x cooridinate 
        let lowestY = 0;
        for (let i = 0; i < this._content.list.length; i++) {
            let child = this._content.list[i];
            if (child.y + child.height > lowestY) {
                lowestY = child.y + child.height;
            }
        }

        this._contentHeight = lowestY;
        this.calculateScrollBarProperties();
    }


	/**
	 * create() 
	 * @description creates the inventory
	 */
	create() {
        this._content = this._layer
            .append("g")

        let border = this._layer
            .append("rect")
                .attr("width", this._width)
                .attr("height", this._height)
                .attr("x", this._position.x)
                .attr("y", this._position.y)
                .style("stroke-width", 5)
                .style("fill", "none")
                .style("stroke", "black")

        let trackWidth = 10;

        

        this._track = this._layer
            .append("rect")
                .attr("x", this._position.x + this._width - trackWidth)
                .attr("y", this._position.y)
                .attr("width", trackWidth)
                .attr("height", this._height)
                .style("fill", "#00ff00")

        this._grip = this._layer
            .append("rect")
                .attr("x", this._position.x + this._width - trackWidth)
                .attr("y", this._position.y)
                .attr("width", trackWidth)
                .attr("height", this._gripSize)
                .style("fill", "#ff00ff")

        let self = this;
        let dragHandler = d3.drag()
            .on("start", (event) => self.startDrag(event))
            .on("drag", (event) => self.drag(event))
            .on("end", (event) => self.endDrag(event))
        
        dragHandler(this._grip);
        
        //this._scene.input.setDraggable(this._grip);
	}

    /**
     * startDrag()
     * @description start dragging the container
     * @param {Pointer} pointer the pointer that started the drag
     * @param {GameObject} gameObject the object that is being dragged
     */
    startDrag(event) {
        ;
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
        this._content.attr("y", this._position.y - this._windowY)
    }

    /**
     * endDrag()
     * @description end dragging the container
     * @param {Pointer} pointer the pointer that ended the drag
     * @param {GameObject} gameObject the object that is being dragged
     */
    endDrag(event) {
        ;
    }







    /**
     * set width()
     * @description sets the width of the inventory
     */
    setWidth(width) {
        this._width = width;
    }

    /**
     * set height()
     * @description sets the height of the inventory
     */
    setHeight(height) {
        this._height = height;
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
			// add the item in the players hand
		}
	}


	


	
}
