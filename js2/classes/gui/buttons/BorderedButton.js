/*
  BorderedButton
  A button with a border around it
*/
class BorderedButton extends Button {
  constructor(position, width, height, borderWidth) {
    super(position, width, height)

    this.borderWidth = borderWidth;

    var mainSVG = d3.select("body").select("svg")
  	this.svg = {
      border: mainSVG.append("rect"),
  		innerRect: mainSVG.append("rect"),
  		label: mainSVG.append("text"),
  		clickBox: mainSVG.append("rect")
  	};
  }


  /**
    createBackgroundSVG()
  	@description Creates the graphics for the background of
  	the button
  */
  createBackgroundSVG() {
    // border
		this.svg.border.attr("x", this.position.x);
		this.svg.border.attr("y", this.position.y);
		this.svg.border.attr("width", this.width);
		this.svg.border.attr("height", this.height);
		this.svg.border.style("fill", "black")

    // inner rectangle
    this.svg.innerRect.attr("x", this.position.x + this.borderWidth);
		this.svg.innerRect.attr("y", this.position.y + this.borderWidth);
		this.svg.innerRect.attr("width", this.width - this.borderWidth * 2);
		this.svg.innerRect.attr("height", this.height - this.borderWidth * 2);
		this.svg.innerRect.style("fill", "white")
  }
}

//export default BorderedButton
