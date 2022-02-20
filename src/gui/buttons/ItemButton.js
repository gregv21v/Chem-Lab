/*
  Button - A button for a game objects

  The button displays the stats of an item as follows:

  Examples:

  Tank
  Dimensions (w by h): 50x50

  Pipe
  Dimensions (w by h): 50x100

  Pump
  Liquid: Water

*/
import * as d3 from "d3"
import Button from "./Button"

export default class ItemButton extends Button {
  constructor(position, width, height) {
    super(position, width, height)

    this.nameText = "Item"
    this.dimensionsText = "A X B"
    this.liquidTypeText = "Water"
    this.isLiquid = false;

    var mainSVG = d3.select("body").select("svg")
    this.svg = {
  		rect: mainSVG.append("rect"),
  		clickBox: mainSVG.append("rect"),
      name: mainSVG.append("text"),
      dimensions: mainSVG.append("text"),
      liquidType: mainSVG.append("text")
    }
  }

  /**
	 * set position
	 * @description sets the position of the Button
	 * @param {Point} value the new position of the button
	 */
	set position(value) {
		this._position = value; 

		// add name text
    this.svg.name.attr("x", this._position.x + 10);
  	this.svg.name.attr("y", this._position.y + 20);


    // add dimensions text
    this.svg.dimensions.attr("x", this._position.x + 10);
  	this.svg.dimensions.attr("y", this._position.y + 40);

    // add liquid type text
    if(this.isLiquid) {
      this.svg.liquidType.attr("x", this._position.x + 10);
    	this.svg.liquidType.attr("y", this._position.y + 60);
    }

    this.svg.clickBox.attr("x", this._position.x);
		this.svg.clickBox.attr("y", this._position.y);

		this.svg.rect.attr("x", this._position.x);
		this.svg.rect.attr("y", this._position.y);
	}

  /**
		createTextSVG()
		@description creates the text svg for the itemButton
		@param svgMain the main svg canvas
	*/
  createTextSVG(svgMain) {

    // add name text
    this.svg.name.attr("x", this._position.x + 10);
  	this.svg.name.attr("y", this._position.y + 20);
    this.svg.name.text(this.nameText)


    // add dimensions text
    this.svg.dimensions.attr("x", this._position.x + 10);
  	this.svg.dimensions.attr("y", this._position.y + 40);
    this.svg.dimensions.text(this.dimensionsText)

    // add liquid type text
    if(this.isLiquid) {
      this.svg.liquidType.attr("x", this._position.x + 10);
    	this.svg.liquidType.attr("y", this._position.y + 60);
      this.svg.liquidType.text(this.liquidTypeText)
    }

  };

  /**
		destroySVG()
		@description destroys the svg
	*/
  destroySVG() {
  	this.svg.name.remove();
    this.svg.dimensions.remove();
    this.svg.liquidType.remove();
  	this.svg.rect.remove();
  	this.svg.clickBox.remove();
  }

  /**
		destroySVG()
		@description sets the fill for the text of the item button
    @param fill an object with fill properties to set the text to
	*/
  setTextFill(fill) {
  	if(fill.hasOwnProperty("color")) {
  		this.svg.name.style("fill", fill.color);
      this.svg.dimensions.style("fill", fill.color);
      this.svg.liquidType.style("fill", fill.color);
    }
  	if(fill.hasOwnProperty("opacity")) {
      this.svg.name.style("fill-opacity", fill.opacity);
      this.svg.dimensions.style("fill-opacity", fill.opacity);
      this.svg.liquidType.style("fill-opacity", fill.opacity);
    }
  };

  /**
		setName()
		@description sets the nume of the item button
    @param name name to be set to
	*/
  setName(name) {
  	this.svg.name.text(name);
  	this.nameText = name;
  };

  /**
		setDimensions()
		@description sets the dimensions of the item
    @param width the width of the item
    @param height the height of the item
	*/
  setDimensions(width, height) {
  	this.svg.dimensions.text(width + "X" + height);
  	this.dimensionsText = width + "X" + height;
  };


  /**
    setLiquidType()
    @description sets the liquid type of the button
    @param liquid the liquide of the item button
  */
  setLiquidType(liquid) {
  	this.svg.liquidType.text(liquid);
  	this.liquidTypeText = liquid;
  };
}
