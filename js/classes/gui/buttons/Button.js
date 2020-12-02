/*
	A button
*/
class Button {
	constructor(position, width, height) {
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
	createOverlaySVG() {
		// click overlay
		this.svg.clickBox.attr("x", this.position.x);
		this.svg.clickBox.attr("y", this.position.y);
		this.svg.clickBox.attr("width", this.width);
		this.svg.clickBox.attr("height", this.height);
		this.svg.clickBox.style("fill", "white");
		this.svg.clickBox.style("fill-opacity", 0);
	}

	/*
		Creates the graphics for the background of
		the button
	*/
	createBackgroundSVG() {
		// background
		this.svg.rect.attr("x", this.position.x);
		this.svg.rect.attr("y", this.position.y);
		this.svg.rect.attr("width", this.width);
		this.svg.rect.attr("height", this.height);
		this.svg.rect.attr("class", "Button");
	}

	/**
		createTextSVG()
		@description Creates the graphics for the text of the
		Button
	*/
	createTextSVG() {
		this.svg.label.attr("x", this.position.x + this.width/2 - (this.text.length * 6)/2);
		this.svg.label.attr("y", this.position.y + this.height/2 + 5);
	}

	/**
		createSVG()
		@description create the svg for the button
	*/
	createSVG() {
		this.createBackgroundSVG()
		this.createTextSVG()
		this.createOverlaySVG()
	};

	/**
		destroySVG()
		@description destroys the svg for the button
	*/
	destroySVG() {
		this.svg.label.remove();
		this.svg.rect.remove();
		this.svg.clickBox.remove();
	}


	/**
		setFill()
		@description sets the fill for the button
		@param fill an object with the color the button
			will be filled with, can include opacity
	*/
	setFill(fill) {
		if(fill.hasOwnProperty("color"))
			this.svg.rect.style("fill", fill.color);
		if(fill.hasOwnProperty("opacity"))
			this.svg.rect.style("fill-opacity", fill.opacity);
	};

	/**
		setTextFill()
		@description sets the fill for the button's text
		@param fill an object with the color the button's text
			will be filled with, can include opacity
	*/
	setTextFill(fill) {
		if(fill.hasOwnProperty("color"))
			this.svg.label.style("fill", fill.color);
		if(fill.hasOwnProperty("opacity"))
			this.svg.label.style("fill-opacity", fill.opacity);
	};


	/**
		setStroke()
		@description sets the stroke properties for the button
		@param stroke an object with the stroke properties to be set
	*/
	setStroke(stroke) {
		if(stroke.hasOwnProperty("color"))
			this.svg.rect.style("stroke", stroke.color);
		if(stroke.hasOwnProperty("width"))
			this.svg.rect.style("stroke-width", stroke.width);
	};

	/**
		setText()
		@description sets the text of the button
		@param text the text to set the button to
	*/
	setText(text) {
		this.svg.label.text(text);
		this.text = text;
	};

	/**
		setOnClickWithParam()
		@description sets the buttons on click function with parameters
		@param onClick the function to call when the button is clicked
		@param param an object with the parameters for the onclick function
	*/
	setOnClickWithParam(onClick, param) {
		this.svg.clickBox.on('click', function() {
			onClick(param);
		});
	};

	/**
		setOnClick()
		@description sets the buttons on click function
		@param onClick the function to call when the button is clicked
	*/
	setOnClick(onClick) {
		this.svg.clickBox.on('click', onClick);
	};

	updateSVG() {
		
	}

}

//export default Button
