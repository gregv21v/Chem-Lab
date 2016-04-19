function Rect()
{
	this.width = 0;
	this.height = 0;
	this.position = {x: 0, y: 0};
	this.fill = {
		opacity: 1.0,
		color: "white"
	};
	this.stroke = {
		color: "blue",
		width: 10
	};
	this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
}

Rect.prototype.contains = function (point) {
	return (
			this.position.x <= point.x
	 && this.position.x + this.width >= point.x
	 && this.position.y <= point.y
	 && this.position.y + this.height >= point.y
 );
};


/*
	Determines if two rectangles intersect
*/
Rect.prototype.intersects = function(rect) {
	// if at least one corner of the rect is in the other rect
	return (
		// this intersects rect
		this.contains({x: rect.position.x, y: rect.position.y}) || // top left
		this.contains({x: rect.position.x + rect.width, y: rect.position.y}) || // top right
		this.contains({x: rect.position.x, y: rect.position.y + rect.height}) || // bottom left
		this.contains({x: rect.position.x + rect.width, y: rect.position.y + rect.height}) || // bottom right
		// rect intersects this
		rect.contains({x: this.position.x, y: this.position.y}) || // top left
		rect.contains({x: this.position.x + this.width, y: this.position.y}) || // top right
		rect.contains({x: this.position.x, y: this.position.y + this.height}) || // bottom left
		rect.contains({x: this.position.x + this.width, y: this.position.y + this.height}) // bottom right
	);
};



/*
	Constructs a rectangle from two points.
*/
Rect.prototype.fromPoints = function (point1, point2) {
	if(point1.x < point2.x) {
		this.position.x = point1.x;
	} else {
		this.position.x = point2.x;
	}

	if(point1.y > point2.y) {
		this.position.y = point1.y;
	} else {
		this.position.y = point2.y;
	}

	this.width = Math.abs(point1.x - point2.x);
	this.height = Math.abs(point1.y - point2.y);
};


Rect.prototype.createSVG = function() {
	var SVGMain = document.querySelector("svg");

	this.updateSVG();

	SVGMain.appendChild(this.svg);
};

Rect.prototype.destroySVG = function() {
	this.svg.remove();
};

Rect.prototype.updateSVG = function() {
	this.svg.setAttribute("width", this.width);
	this.svg.setAttribute("height", this.height);
	this.svg.setAttribute("x", this.position.x);
	this.svg.setAttribute("y", this.position.y);
	this.svg.setAttribute("stroke-width", this.stroke.width);
	this.svg.setAttribute("stroke", this.stroke.color);
	this.svg.setAttribute("fill", this.fill.color);
	this.svg.setAttribute("fill-opacity", this.fill.opacity);
};
