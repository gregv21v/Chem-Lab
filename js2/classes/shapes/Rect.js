class Rect {
	constructor() {
		this.width = 0;
		this.height = 0;
		this.position = {x: 0, y: 0}; // top left corner
		this.fill = {
			opacity: 1.0,
			color: "white"
		};
		this.stroke = {
			color: "blue",
			width: 1
		};

		var mainSVG = d3.select("body").select("svg")
		this.svg = mainSVG.append("rect");
	}

	getCenter() {
		return {
			x: this.position.x + this.width / 2,
			y: this.position.y + this.height / 2
		}
	}

	contains (point) {
		return (
				(this.position.x <= point.x
		 && this.position.x + this.width >= point.x)
		 && (this.position.y <= point.y
		 && this.position.y + this.height >= point.y)
	 );
	};


	/*
		Determines if two rectangles intersect
	*/
	intersects(rect) {
		// if at least one corner of the rect is in the other rect
		return (
			// this.rect intersects rect
			this.contains({x: rect.position.x, y: rect.position.y}) || // top left
			this.contains({x: rect.position.x + rect.width, y: rect.position.y}) || // top right
			this.contains({x: rect.position.x, y: rect.position.y + rect.height}) || // bottom left
			this.contains({x: rect.position.x + rect.width, y: rect.position.y + rect.height}) || // bottom right
			// rect intersects this.rect
			rect.contains({x: this.position.x, y: this.position.y}) || // top left
			rect.contains({x: this.position.x + this.width, y: this.position.y}) || // top right
			rect.contains({x: this.position.x, y: this.position.y + this.height}) || // bottom left
			rect.contains({x: this.position.x + this.width, y: this.position.y + this.height}) // bottom right
		);
	};

	snapTo (object) {
		// TODO: Implement rect snapping to other rectangles
	};



	/*
		Constructs a rectangle from two points.
	*/
	fromPoints (point1, point2) {
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


	createSVG() {
		this.svg.attr("width", this.width);
		this.svg.attr("height", this.height);
		this.svg.attr("x", this.position.x);
		this.svg.attr("y", this.position.y);
		this.svg.attr("stroke-width", this.stroke.width);
		this.svg.attr("stroke", this.stroke.color);
		this.svg.attr("fill", this.fill.color);
		this.svg.attr("fill-opacity", this.fill.opacity);
	};

	destroySVG() {
		this.svg.attr("width", 0)
	};

	updateSVG() {
	}

}
