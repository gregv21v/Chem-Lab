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

  this.svg = {
    name: document.createElementNS("http://www.w3.org/2000/svg", "text"),
    dimensions: document.createElementNS("http://www.w3.org/2000/svg", "text"),
    liquidType: document.createElementNS("http://www.w3.org/2000/svg", "text"),
		rect: document.createElementNS("http://www.w3.org/2000/svg", "rect"),
		clickBox: document.createElementNS("http://www.w3.org/2000/svg", "rect")
  }
}

ItemButton.prototype = Object.create(Button.prototype)
ItemButton.prototype.constructor = ItemButton


ItemButton.prototype.createTextSVG = function (svgMain) {

  // add name text
  this.svg.name.setAttribute("x", this.position.x + 10);
	this.svg.name.setAttribute("y", this.position.y + 20);
  this.svg.name.textContent = this.nameText
  svgMain.appendChild(this.svg.name)


  // add dimensions text
  this.svg.dimensions.setAttribute("x", this.position.x + 10);
	this.svg.dimensions.setAttribute("y", this.position.y + 40);
  this.svg.dimensions.textContent = this.dimensionsText
  svgMain.appendChild(this.svg.dimensions)

  // add liquid type text
  if(this.isLiquid) {
    this.svg.liquidType.setAttribute("x", this.position.x + 10);
  	this.svg.liquidType.setAttribute("y", this.position.y + 60);
    this.svg.liquidType.textContent = this.liquidTypeText
    svgMain.appendChild(this.svg.liquidType)

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
		this.svg.name.setAttribute("fill", fill.color);
    this.svg.dimensions.setAttribute("fill", fill.color);
    this.svg.liquidType.setAttribute("fill", fill.color);
  }
	if(fill.hasOwnProperty("opacity")) {
    this.svg.name.setAttribute("fill-opacity", fill.opacity);
    this.svg.dimensions.setAttribute("fill-opacity", fill.opacity);
    this.svg.liquidType.setAttribute("fill-opacity", fill.opacity);
  }
};


ItemButton.prototype.setName = function(name) {
	this.svg.name.textContent = name;
	this.nameText = name;
};

ItemButton.prototype.setDimensions = function(width, height) {
	this.svg.dimensions.textContent = width + "X" + height;
	this.dimensionsText = width + "X" + height;
};

ItemButton.prototype.setLiquidType = function(liquid) {
	this.svg.liquidType.textContent = liquid;
	this.liquidTypeText = liquid;
};
