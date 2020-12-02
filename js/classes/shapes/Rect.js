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


	intersects(rect) {
		// if at least one corner of the rect is in the other rect
		return (
			// this.rect intersects rect
			this.contains({x: rect.position.x,
            			   y: rect.position.y}) || // top left
			this.contains({x: rect.position.x + rect.width,
                           y: rect.position.y}) || // top right
			this.contains({x: rect.position.x,
                           y: rect.position.y + rect.height}) || // bottom left
			this.contains({x: rect.position.x + rect.width,
                           y: rect.position.y + rect.height}) || // bottom right
			// rect intersects this.rect
			rect.contains({x: this.position.x,
                           y: this.position.y}) || // top left
			rect.contains({x: this.position.x + this.width,
                           y: this.position.y}) || // top right
			rect.contains({x: this.position.x,
                           y: this.position.y + this.height}) || // bottom left
			rect.contains({x: this.position.x + this.width,
                           y: this.position.y + this.height}) // bottom right
		);
	};

	/*
		Determines if two rectangles are intersecting
	*/
	intersects2(rect) {
		let linesFromThis = this.breakIntoLines()
		let linesFromRect = rect.breakIntoLines()

		let point1 = linesFromThis["up"].findIntersectionPoint(linesFromRect["left"])
		let point2 = linesFromThis["up"].findIntersectionPoint(linesFromRect["right"])
		let point3 = linesFromThis["down"].findIntersectionPoint(linesFromRect["left"])
		let point4 = linesFromThis["down"].findIntersectionPoint(linesFromRect["right"])

		if(this.contains(point1) && rect.contains(point1)) {
			var circle = new Circle(point1, 3)
			circle.color = "blue"
			circle.createSVG()
			console.log("point1");
			return true;
		}

		if(this.contains(point2) && rect.contains(point2)) {
			var circle = new Circle(point1, 3)
			circle.color = "orange"
			circle.createSVG()
			console.log("Point2");
			return true;
		}

		if(this.contains(point3) && rect.contains(point3)) {
			var circle = new Circle(point1, 3)
			circle.color = "pink"
			circle.createSVG()
			console.log("Point3");
			return true;
		}

		if(this.contains(point4) && rect.contains(point4)) {
			var circle = new Circle(point1, 3)
			circle.color = "teal"
			circle.createSVG()
			console.log("Point4");
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
		var mainSVG = d3.select("body").select("svg")
		this.svg = mainSVG.append("rect");

		this.updateSVG()
	};

	destroySVG() {
		this.svg.attr("width", 0)
	};

	updateSVG() {
		this.svg
			.attr("width", this.width)
			.attr("height", this.height)
			.attr("x", this.position.x)
			.attr("y", this.position.y)
			.attr("stroke-width", this.stroke.width)
			.attr("stroke", this.stroke.color)
			.attr("fill", this.fill.color)
			.attr("fill-opacity", this.fill.opacity)
	}

}
