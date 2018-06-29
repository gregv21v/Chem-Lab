/*
  A button for a game objects

  The button displays the stats of an item as follows:

  Examples:

  Tank
  Dimensions (w by h): 50x50

  Pipe
  Dimensions (w by h): 50x100

  Pump
  Liquid: Water

*/
function ItemButton(position, width, height) {

  Button.call(this, position, width, height)

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

ItemButton.prototype = Object.create(Button.prototype)
ItemButton.prototype.constructor = ItemButton


ItemButton.prototype.createTextSVG = function (svgMain) {

  // add name text
  this.svg.name.attr("x", this.position.x + 10);
	this.svg.name.attr("y", this.position.y + 20);
  this.svg.name.text(this.nameText)


  // add dimensions text
  this.svg.dimensions.attr("x", this.position.x + 10);
	this.svg.dimensions.attr("y", this.position.y + 40);
  this.svg.dimensions.text(this.dimensionsText)

  // add liquid type text
  if(this.isLiquid) {
    this.svg.liquidType.attr("x", this.position.x + 10);
  	this.svg.liquidType.attr("y", this.position.y + 60);
    this.svg.liquidType.text(this.liquidTypeText)

  }

};

ItemButton.prototype.destroySVG = function() {
	this.svg.name.remove();
  this.svg.dimensions.remove();
  this.svg.liquidType.remove();
	this.svg.rect.remove();
	this.svg.clickBox.remove();
}

ItemButton.prototype.setTextFill = function(fill) {
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


ItemButton.prototype.setName = function(name) {
	this.svg.name.text(name);
	this.nameText = name;
};

ItemButton.prototype.setDimensions = function(width, height) {
	this.svg.dimensions.text(width + "X" + height);
	this.dimensionsText = width + "X" + height;
};

ItemButton.prototype.setLiquidType = function(liquid) {
	this.svg.liquidType.text(liquid);
	this.liquidTypeText = liquid;
};
