/*
  Button - A button for a GameObjects

  The button displays the stats of an item as follows:

  Examples:

  Tank
  Dimensions (w by h): 50x50

  Pipe
  Dimensions (w by h): 50x100

  Pump
  Liquid: Water

*/
import Pump from "../../world_objects/Pump";
import MultiLineText from "../MultiLineText";
import Button from "./Button"
import * as d3 from "d3"

export default class ItemButton extends Button {
  /**
   * constructor() 
   * @description constructs the itemButton
   * @param {Point} position the position of the button
   * @param {Number} width the width of the button
   * @param {Number} height the height of the button
   */
  constructor(layer, position, width, height) {
    super(layer, position, width, height)

    this._item = undefined; // the item attached to this button

    this._nameText = "Item"
    this._dimensionsText = "A X B"
    this._descriptionText = ["This item does", "such and such."]
    this._FluidTypeText = "Water"
    this._isFluid = false;
  }

  

  /**
	 * create() 
	 * @description creates the graphics and attach it to the parent
   * @param {HTMLElement} parent the parent element to attach the svg to
	 */
	create() {
    this._group = d3.create("svg:g")
    this._layer.append(() => this._group.node())

    let self = this;

    let descriptionTemp = new MultiLineText(
      this._group, this._descriptionText, 
      {x: this._position.x + 40 + 40, y: this._position.y + 20}
    )

    descriptionTemp.create();

    this._svg = {
  		rect: this._group.append("rect"),
      name: this._group.append("text"),
      dimensions: this._group.append("text"),
      description: descriptionTemp,
      fluidType: this._group.append("text"),
      clickBox: this._group.append("rect"),
      thumbnail: undefined
    }


    this._group.attr("name", "ItemButton")
    this._svg.rect.attr("name", "rect")
    this._svg.name.attr("name", "name")
    this._svg.dimensions.attr("name", "dimensions")
    this._svg.fluidType.attr("name", "fluidType")
    this._svg.clickBox.attr("name", "clickBox")

    this._svg.clickBox.style("fill-opacity", 0);
    this._svg.clickBox.on("click", () => self.onClick())

    this.width = this._width;
		this.height = this._height;
		this.position = this._position;

    this.styling = {
      color: "blue", 
      opacity: 0.5,
      strokeColor: "black",
      strokeWidth: 10,
      textColor: "black",
      textOpacity: 1
    }

	}

  /**
		createTextSVG()
		@description creates the text svg for the itemButton
	*/
  createTextSVG() {

    // add name text
    this._svg.name.attr("x", this._position.x + 70);
  	this._svg.name.attr("y", this._position.y + 20);
    this._svg.name.style("font-size", "20px");
    this._svg.name.text(this._nameText)

    // add dimensions text
    this._svg.dimensions.attr("x", this._position.x + 70);
  	this._svg.dimensions.attr("y", this._position.y + 40);
    this._svg.dimensions.text(this._dimensionsText)


    // add description text 
    this._svg.description.position = {
      x: this._position.x + 40 + 40, y: this._position.y + 20 + 60
    }

    // add liquid type text
    if(this._isFluid) {
      this._svg.fluidType.attr("x", this._position.x + 10);
    	this._svg.fluidType.attr("y", this._position.y + 60);
      this._svg.fluidType.text(this._fluidTypeText)
    }

  };


  /**
   * set item()
   * @description sets the item of this ItemButton
   * @param {Item} the item to set the item button to
   */
  set item(value) {
    this._item = value;


    this._thumbnail = this._item.getThumbnail(
      this._position.x + 10, this._position.y + 10, .5, this._group 
    );

    this._thumbnail.update();

    console.log(this._thumbnail);

  }

  /**
		set name()
		@description sets the name of the item button
    @param name name to be set to
	*/
  set name(value) {
  	this._svg.name.text(value);
  	this._nameText = value;
  };

  /**
		setDimensions()
		@description sets the dimensions of the item
    @param width the width of the item
    @param height the height of the item
	*/
  setDimensions(width, height) {
  	this._svg.dimensions.text(width + "X" + height);
  	this._dimensionsText = width + "X" + height;
  };

  /**
		set description()
		@description sets the description of the item button
    @param {String} description description to be set to
	*/
  set description(value) {
    this._svg.description.text = value;
    this._descriptionText = value;
  }


  /**
	 * set styling
	 * @description sets the styling of the button
	 * @param {Object} styling the styling of the object
	 * 
	 * attributes:
	 * 	color - the color of the button
	 *  opacity - the opacity of the button
	 *  strokeColor - the color of the stroke of the border of the button
	 *  strokeWidth - the width of the stroke of the border of the button
	 *  textColor - the color of the buttons label
	 *  textOpacity - the opacity of the buttons label
	 */
	set styling(value) {
	  this._styling = value;
 
		if(value.hasOwnProperty("color"))
      this._svg.rect.style("fill", value.color);

		if(value.hasOwnProperty("opacity"))
			this._svg.rect.style("fill-opacity", value.opacity);

		if(value.hasOwnProperty("textColor")) {
      this._svg.name.style("fill", value.textColor);
      this._svg.dimensions.style("fill", value.textColor);
      this._svg.fluidType.style("fill", value.textColor);
    }

		if(value.hasOwnProperty("strokeColor"))
			this._svg.rect.style("stroke", value.strokeColor);
		
		if(value.hasOwnProperty("strokeWidth"))
			this._svg.rect.style("stroke-width", value.strokeWidth);
		
	}


  /**
    set fluidType()
    @description sets the fluid type of the button
    @param value the name of the fluid type
  */
  set fluidType(value) {
  	this._svg.fluidType.text(value);
  	this.fluidTypeText = value;
  };


  /**
	 * set position
	 * @description sets the position of the Button
	 * @param {Point} value the new position of the button
	 */
	set position(value) {
		this._position = value; 

		// add name text
    this._svg.name.attr("x", this._position.x + 10 + 60);
  	this._svg.name.attr("y", this._position.y + 20);


    // add dimensions text
    this._svg.dimensions.attr("x", this._position.x + 10 + 60);
  	this._svg.dimensions.attr("y", this._position.y + 40);

    // add description text 
    this._svg.description.position = {
      x: this._position.x + 10 + 60, y: this._position.y + 60
    }

    // add liquid type text
    if(this._isFluid) {
      this._svg.fluidType.attr("x", this._position.x + 10 + 60);
    	this._svg.fluidType.attr("y", this._position.y + 60);
    }

    
    if(this._thumbnail) {
      this._thumbnail.moveTo(
        this._position.x + 10 + this._thumbnail.width / 2, this._position.y + 10 + this._thumbnail.height / 2
      )
      this._thumbnail.update();
    }

    this._svg.clickBox.attr("x", this._position.x);
		this._svg.clickBox.attr("y", this._position.y);

		this._svg.rect.attr("x", this._position.x);
		this._svg.rect.attr("y", this._position.y);
	}
}
