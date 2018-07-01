/*
	A button
*/

function Button(position, width, height) {
	this.position = position;
	this.width = width;
	this.height = height;
	this.text = "";

	var mainSVG = d3.select("body").select("svg")
	this.svg = {
		rect: mainSVG.append("rect"),
		label: mainSVG.append("text"),
		clickBox: mainSVG.append("rect")
	};
}

/*
	Creates the graphics for the overlay of the
	button
*/
Button.prototype.createOverlaySVG = function () {

	var self = this;

	// click overlay
	this.svg.clickBox.attr("x", this.position.x);
	this.svg.clickBox.attr("y", this.position.y);
	this.svg.clickBox.attr("width", this.width);
	this.svg.clickBox.attr("height", this.height);
	this.svg.clickBox.style("fill", "white");
	this.svg.clickBox.style("fill-opacity", 0);
	this.svg.clickBox.on("click", function() {
		if(self.enabled) {
			self.onClick();
		}
	})

};


/*
	Creates the graphics for the background of
	the button
*/
Button.prototype.createBackgroundSVG = function () {

		// background
		this.svg.rect.attr("x", this.position.x);
		this.svg.rect.attr("y", this.position.y);
		this.svg.rect.attr("width", this.width);
		this.svg.rect.attr("height", this.height);
		this.svg.rect.attr("class", "Button");

};

/*
	Creates the graphics for the text of the
	Button
*/
Button.prototype.createTextSVG = function () {

	this.svg.label.attr("x", this.position.x + this.width/2 - (this.text.length * 6)/2);
	this.svg.label.attr("y", this.position.y + this.height/2 + 5);


};



Button.prototype.createSVG = function() {

	this.createBackgroundSVG()
	this.createTextSVG()
	this.createOverlaySVG()

};

Button.prototype.destroySVG = function() {
	this.svg.label.remove();
	this.svg.rect.remove();
	this.svg.clickBox.remove();
}

Button.prototype.enable = function () {
	this.enabled = true;
};

Button.prototype.disable = function () {
	this.enabled = false;
};



Button.prototype.setFill = function(fill) {
	if(fill.hasOwnProperty("color"))
		this.svg.rect.style("fill", fill.color);
	if(fill.hasOwnProperty("opacity"))
		this.svg.rect.style("fill-opacity", fill.opacity);
};

Button.prototype.setTextFill = function(fill) {
	if(fill.hasOwnProperty("color"))
		this.svg.label.style("fill", fill.color);
	if(fill.hasOwnProperty("opacity"))
		this.svg.label.style("fill-opacity", fill.opacity);
};


Button.prototype.setStroke = function(stroke) {
	if(stroke.hasOwnProperty("color"))
		this.svg.rect.style("stroke", stroke.color);
	if(stroke.hasOwnProperty("width"))
		this.svg.rect.style("stroke-width", stroke.width);
};

Button.prototype.setText = function(text) {
	this.svg.label.text(text);
	this.text = text;
};

Button.prototype.setOnClickWithParam = function(onClick, param) {
	this.svg.clickBox.on('click', function() {
		if(this.enabled)
			onClick(param);
	});
};

Button.prototype.setOnClick = function(onClick) {
	this.svg.clickBox.on('click', function() {
		if(this.enabled)
			onClick()
	});
};

Button.prototype.onClick = function () {
	// do nothing by default
};
