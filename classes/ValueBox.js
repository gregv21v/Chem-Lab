function ValueBox(position, width, height) {
	this.position = position;
	this.width = width;
	this.height = height;
	this.label = "";
  this.value = 0;

	this.svg = {
		label: document.createElementNS("http://www.w3.org/2000/svg", "text"),
		rect: document.createElementNS("http://www.w3.org/2000/svg", "rect")
	};
}
ValueBox.prototype.createSVG = function() {
	var svgMain = document.querySelector("svg");

	// background
	this.svg.rect.setAttribute("x", this.position.x);
	this.svg.rect.setAttribute("y", this.position.y);
	this.svg.rect.setAttribute("width", this.width);
	this.svg.rect.setAttribute("height", this.height);
	this.svg.rect.setAttribute("class", "ValueBox");

	this.svg.label.setAttribute("x", this.position.x + this.width/2 - ((this.label.length + ("" + this.value).length) * 6)/2);
	this.svg.label.setAttribute("y", this.position.y + this.height/2 + 5);


	svgMain.appendChild(this.svg.rect);
	svgMain.appendChild(this.svg.label);
};

ValueBox.prototype.destroySVG = function() {
	this.svg.label.remove();
	this.svg.rect.remove();
}

ValueBox.prototype.setFill = function(fill) {
	if(fill.hasOwnProperty("color"))
		this.svg.rect.setAttribute("fill", fill.color);
	if(fill.hasOwnProperty("opacity"))
		this.svg.rect.setAttribute("fill-opacity", fill.opacity);
};

ValueBox.prototype.setTextFill = function(fill) {
	if(fill.hasOwnProperty("color"))
		this.svg.label.setAttribute("fill", fill.color);
	if(fill.hasOwnProperty("opacity"))
		this.svg.label.setAttribute("fill-opacity", fill.opacity);
};


ValueBox.prototype.setStroke = function(stroke) {
	if(stroke.hasOwnProperty("color"))
		this.svg.rect.setAttribute("stroke", stroke.color);
	if(stroke.hasOwnProperty("width"))
		this.svg.rect.setAttribute("stroke-width", stroke.width);
};

ValueBox.prototype.setLabel = function(label) {
  this.label = label;
	this.svg.label.textContent = this.label + ": " + this.value;
};

ValueBox.prototype.setValue = function (value) {
  this.value = value;
	this.svg.label.textContent = this.label + ": " + this.value;
};

ValueBox.prototype.updateText = function () {
	this.svg.label.textContent = this.label + ": " + this.value;
};
