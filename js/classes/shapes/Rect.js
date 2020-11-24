class Rect {
	constructor() {
		this.width = 0;
		this.height = 0;
		this.position = {x: 0, y: 0}; // top left corner
		this.fill = {
			opacity: 0.5,
			color: "orange"
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

	centerAt(point) {
		this.position.x = point.x - this.width / 2
		this.position.y = point.y - this.height / 2
	}

	contains (point) {
		return (
				(this.position.x <= point.x
		 && this.position.x + this.width >= point.x)
		 && (this.position.y <= point.y
		 && this.position.y + this.height >= point.y)
	 );
	};

	getCorners() {
		return {
			topLeft: {
				x: this.position.x,
				y: this.position.y
			},
			bottomRight: {
				x: this.position.x + this.width,
				y: this.position.y + this.height
			}
		}
	}

	breakIntoLines() {
		return {
			up: new Line( // up
				new Point(this.position.x, this.position.y),
				new Point(this.position.x + this.width, this.position.x)
			),
			down: new Line( // down
				new Point(this.position.x, this.position.y + this.height),
				new Point(this.position.x + this.width, this.position.y + this.height)
			),
			left: new Line( // left
				new Point(this.position.x, this.position.y),
				new Point(this.position.x, this.position.y + this.height)
			),
			right: new Line( // right
				new Point(this.position.x + this.width, this.position.y),
				new Point(this.position.x + this.width, this.position.y + this.height)
			)
		}
	}

	/*
		Determines if two rectangles are intersecting
	*/
	intersects(rect) {
		var linesFromThis = this.breakIntoLines()
		var linesFromRect = rect.breakIntoLines()

		if(
			linesFromThis["up"].intersects(linesFromRect["left"]) ||
			linesFromThis["up"].intersects(linesFromRect["right"])
		) {
			return true;
		}

		if(
			linesFromThis["down"].intersects(linesFromRect["left"]) ||
			linesFromThis["down"].intersects(linesFromRect["right"])
		) {
			return true;
		}

		return false;
	};


	rotate(degrees) {
		var center = this.getCenter();
		var radians = degrees * Math.PI / 180
		var x = center.x * Math.cos(radians) - center.y * Math.sin(radians)
		var y = center.x * Math.sin(radians) + center.y * Math.cos(radians)

		this.position = {
			x: x,
			y: y
		}
	}

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
		this.svg
			.attr("width", this.width)
			.attr("height", this.height)
			.attr("x", this.position.x)
			.attr("y", this.position.y)
			.attr("stroke-width", this.stroke.width)
			.attr("stroke", this.stroke.color)
			.attr("fill", this.fill.color)
			.attr("fill-opacity", this.fill.opacity)
	};

	destroySVG() {
		this.svg.attr("width", 0)
	};

	updateSVG() {
	}

}
