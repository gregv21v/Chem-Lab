/*
	A button
*/

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

/*
	Creates the graphics for the overlay of the 
	button
*/
Button.prototype.createOverlaySVG = function (svgMain) {

	// click overlay
	this.svg.clickBox.setAttribute("x", this.position.x);
	this.svg.clickBox.setAttribute("y", this.position.y);
	this.svg.clickBox.setAttribute("width", this.width);
	this.svg.clickBox.setAttribute("height", this.height);
	this.svg.clickBox.setAttribute("fill", "white");
	this.svg.clickBox.setAttribute("fill-opacity", 0);

	svgMain.appendChild(this.svg.clickBox);

};


/*
	Creates the graphics for the background of
	the button
*/
Button.prototype.createBackgroundSVG = function (svgMain) {

		// background
		this.svg.rect.setAttribute("x", this.position.x);
		this.svg.rect.setAttribute("y", this.position.y);
		this.svg.rect.setAttribute("width", this.width);
		this.svg.rect.setAttribute("height", this.height);
		this.svg.rect.setAttribute("class", "Button");

		svgMain.appendChild(this.svg.rect);
};

/*
	Creates the graphics for the text of the
	Button
*/
Button.prototype.createTextSVG = function (svgMain) {

	this.svg.label.setAttribute("x", this.position.x + this.width/2 - (this.text.length * 6)/2);
	this.svg.label.setAttribute("y", this.position.y + this.height/2 + 5);

	svgMain.appendChild(this.svg.label)

};



Button.prototype.createSVG = function() {
	var svgMain = document.querySelector("svg");

	this.createBackgroundSVG(svgMain)
	this.createTextSVG(svgMain)
	this.createOverlaySVG(svgMain)

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
