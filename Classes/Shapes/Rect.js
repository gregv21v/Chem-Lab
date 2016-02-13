function Rect(position, width, height, color, fillOpacity)
{
	this.width = width;
	this.height = height;
	this.position = position;
	this.color = color;
	this.fillOpacity = fillOpacity;
	this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
}


/*
	Determines if two rectangles intersect
*/
Rect.prototype.intersects = function(rect) {
	// if at least one corner of the rect is in the other rect
	return  (
				// this intersects rect
			   ( // top left
					   this.position.x <= rect.position.x
					&& this.position.x + this.width >= rect.position.x
					&& this.position.y <= rect.position.y
					&& this.position.y + this.height >= rect.position.y
			   ) ||
			   ( // top right
					   this.position.x <= rect.position.x + rect.width
					&& this.position.x + this.width >= rect.position.x + rect.width
					&& this.position.y <= rect.position.y
					&& this.position.y + this.height >= rect.position.y
			   ) ||
			   ( // bottom left
					   this.position.x <= rect.position.x
					&& this.position.x + this.width >= rect.position.x
					&& this.position.y <= rect.position.y + rect.height
					&& this.position.y + this.height >= rect.position.y + rect.height
			   ) ||
			   ( // bottom right
					   this.position.x <= rect.position.x + rect.width
					&& this.position.x + this.width >= rect.position.x + rect.width
					&& this.position.y <= rect.position.y + rect.height
					&& this.position.y + this.height >= rect.position.y + rect.height
			   ) ||
			   // rect intersects this
			   ( // top left
					   rect.position.x <= this.position.x
					&& rect.position.x + rect.width >= this.position.x
					&& rect.position.y <= this.position.y
					&& rect.position.y + rect.height >= this.position.y
			   ) ||
			   ( // top right
					   rect.position.x <= this.position.x + this.width
					&& rect.position.x + rect.width >= this.position.x + this.width
					&& rect.position.y <= this.position.y
					&& rect.position.y + rect.height >= this.position.y
			   ) ||
			   ( // bottom left
					   rect.position.x <= this.position.x
					&& rect.position.x + rect.width >= this.position.x
					&& rect.position.y <= this.position.y + this.height
					&& rect.position.y + rect.height >= this.position.y + this.height
			   ) ||
			   ( // bottom right
					   rect.position.x <= this.position.x + this.width
					&& rect.position.x + rect.width >= this.position.x + this.width
					&& rect.position.y <= this.position.y + this.height
					&& rect.position.y + rect.height >= this.position.y + this.height
			   )
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
	this.svg.setAttribute("fill", this.color);
	this.svg.setAttribute("fill-opacity", this.fillOpacity);
};
