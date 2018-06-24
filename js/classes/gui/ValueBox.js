function ValueBox(position, width, height) {
	this.position = position;
	this.width = width;
	this.height = height;
	this.label = "";
  this.value = 0;

	var svgMain = d3.select("body").select("svg");
	this.svg = {
		label: svgMain.append("text"),
		rect: svgMain.append("rect")
	};

}
ValueBox.prototype.createSVG = function() {
	var svgMain = d3.select("body").select("svg");


	// background
	this.svg.rect.attr("x", this.position.x);
	this.svg.rect.attr("y", this.position.y);
	this.svg.rect.attr("width", this.width);
	this.svg.rect.attr("height", this.height);
	this.svg.rect.attr("class", "ValueBox");

	this.svg.label.attr("x", this.position.x + this.width/2 - ((this.label.length + ("" + this.value).length) * 6)/2);
	this.svg.label.attr("y", this.position.y + this.height/2 + 5);

};

ValueBox.prototype.destroySVG = function() {
	this.svg.label.remove();
	this.svg.rect.remove();
}

ValueBox.prototype.setFill = function(fill) {
	if(fill.hasOwnProperty("color"))
		this.svg.rect.attr("fill", fill.color);
	if(fill.hasOwnProperty("opacity"))
		this.svg.rect.attr("fill-opacity", fill.opacity);
};

ValueBox.prototype.setTextFill = function(fill) {
	if(fill.hasOwnProperty("color"))
		this.svg.label.attr("fill", fill.color);
	if(fill.hasOwnProperty("opacity"))
		this.svg.label.attr("fill-opacity", fill.opacity);
};


ValueBox.prototype.setStroke = function(stroke) {
	if(stroke.hasOwnProperty("color"))
		this.svg.rect.attr("stroke", stroke.color);
	if(stroke.hasOwnProperty("width"))
		this.svg.rect.attr("stroke-width", stroke.width);
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
