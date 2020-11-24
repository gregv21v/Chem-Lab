  function Distance(point1, point2) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
}


class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y
  }

  subtract(point) {
    return new Point(
      this.x - point.x,
      this.y - point.y
    )
  }

  add(point) {
    return new Point(
      this.x + point.x,
      this.y + point.y
    )
  }

  /**
    cross(point)
    @description gets the scalar magnatude of this point crossed with
      another point
    @param point the other point to cross with 
  */
  cross(point) {
    return point.y * this.x - point.x * this.y;
  }

  dot(point) {
    return point.x * this.x + point.y * this.y;
  }

  toArray() {
    return [
      this.x, this.y
    ]
  }

  distanceTo(point) {
    return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2))
  }

  createSVG() {
    var mainSVG = d3.select("body").select("svg");
		this.svg = mainSVG.append("circle");

		this.svg.attr("r", 5);
		this.svg.attr("cx", this.x);
		this.svg.attr("cy", this.y);
		this.svg.attr("fill", this.color);
		this.svg.attr("fill-opacity", this.fillOpacity);
  }

  static fromArray(arr) {
    this.x = arr[0]
    this.y = arr[1]
  }
}
