function Button(position, width, height) {
	this.position = position;
	this.width = width;
	this.height = height;
	this.text = "";
	this.svg = {
		label: document.createElementNS("http://www.w3.org/2000/svg", "text"),
		rect: document.createElementNS("http://www.w3.org/2000/svg", "rect"),
		clickBox: document.createElementNS("http://www.w3.org/2000/svg", "rect")
	};
}
Button.prototype.createSVG = function() {
	var svgMain = document.querySelector("svg");

	// click overlay
	this.svg.clickBox.setAttribute("x", this.position.x);
	this.svg.clickBox.setAttribute("y", this.position.y);
	this.svg.clickBox.setAttribute("width", this.width);
	this.svg.clickBox.setAttribute("height", this.height);
	this.svg.clickBox.setAttribute("fill", "white");
	this.svg.clickBox.setAttribute("fill-opacity", 0);

	// background
	this.svg.rect.setAttribute("x", this.position.x);
	this.svg.rect.setAttribute("y", this.position.y);
	this.svg.rect.setAttribute("width", this.width);
	this.svg.rect.setAttribute("height", this.height);
	this.svg.rect.setAttribute("class", "Button");

	this.svg.label.setAttribute("x", this.position.x + this.width/2 - (this.text.length * 6)/2);
	this.svg.label.setAttribute("y", this.position.y + this.height/2 + 5);


	svgMain.appendChild(this.svg.rect);
	svgMain.appendChild(this.svg.label);
	svgMain.appendChild(this.svg.clickBox);
};

Button.prototype.destroySVG = function() {
	this.svg.label.remove();
	this.svg.rect.remove();
	this.svg.clickBox.remove();
}



Button.prototype.setFill = function(fill) {
	if(fill.hasOwnProperty("color"))
		this.svg.rect.setAttribute("fill", fill.color);
	if(fill.hasOwnProperty("opacity"))
		this.svg.rect.setAttribute("fill-opacity", fill.opacity);
};

Button.prototype.setTextFill = function(fill) {
	if(fill.hasOwnProperty("color"))
		this.svg.label.setAttribute("fill", fill.color);
	if(fill.hasOwnProperty("opacity"))
		this.svg.label.setAttribute("fill-opacity", fill.opacity);
};


Button.prototype.setStroke = function(stroke) {
	if(stroke.hasOwnProperty("color"))
		this.svg.rect.setAttribute("stroke", stroke.color);
	if(stroke.hasOwnProperty("width"))
		this.svg.rect.setAttribute("stroke-width", stroke.width);
};

Button.prototype.setText = function(text) {
	this.svg.label.textContent = text;
	this.text = text;
};

Button.prototype.setOnClickWithParam = function(onClick, param) {
	this.svg.clickBox.addEventListener('click', function() {
		onClick(param);
	});
};

Button.prototype.setOnClick = function(onClick) {
	this.svg.clickBox.addEventListener('click', onClick);
};
