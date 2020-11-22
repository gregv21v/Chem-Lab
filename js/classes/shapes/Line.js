class Line {
  constructor(point1, point2) {
    this.point1 = point1
    this.point2 = point2

    this.color = "red"
  }

  /**
    intersects()
    @description returns true if two line segments intersect
    @param line the line to check intersection with
  */
  intersects(line) {
    // equation for this line
    var thisA = this.point2.y - this.point1.y
    var thisB = this.point1.x - this.point2.x
    var thisC = thisA * this.point1.x + thisB * this.point1.y

    // equation for the other line
    var lineA = line.point2.y - line.point1.y
    var lineB = line.point1.x - line.point2.x
    var lineC = lineA * line.point1.x + lineB * line.point1.y

    var det = thisA * lineB - lineA * thisB;
    //console.log(thisA * lineB);
    //console.log(lineA * thisB);


    if(det == 0) {
      // lines are parallel, so do nothing
      return false
    } else {
      var intersectionPoint = new Point (
        (lineB*thisC - thisB*lineC)/det,
        (thisA*lineC - lineA*thisC)/det
      )
      return this.pointWithinSegment(intersectionPoint)
    }
  }

  getLength() {
    return Math.sqrt(Math.pow(this.point2.x - this.point1.x, 2) + Math.pow(this.point2.y - this.point1.y))
  }

  // https://stackoverflow.com/questions/328107/how-can-you-determine-a-point-is-between-two-other-points-on-a-line-segment
  pointWithinSegment(point) {
    var p2MinusP1 = this.point2.subtract(this.point1)
    var pMinusP1 = point.subtract(this.point1)
    var crossProduct = p2MinusP1.cross(pMinusP1)
    var dotProduct = p2MinusP1.dot(pMinusP1)
    var squaredLengthOfThisLine = Math.pow(this.point2.x - this.point1.x, 2) +
      Math.pow(this.point2.y - this.point1.y, 2)

    if(Math.abs(crossProduct) > Number.EPSILON) {
      return false
    }

    if(dotProduct < 0) {
      return false
    }

    if(dotProduct > squaredLengthOfThisLine) {
      return false
    }

    return true;
  }


  /**
    createSVG()
    @description creates the svg for the line
  */
  createSVG() {
    var mainSVG = d3.select("body").select("svg")
    this.svg = mainSVG.append("line")
      .attr("x1", this.point1.x)
      .attr("y1", this.point1.y)
      .attr("x2", this.point2.x)
      .attr("y2", this.point2.y)
      .style("stroke", this.color)
      .style("stroke-width", 1)
  }


}
