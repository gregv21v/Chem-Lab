
/**
 * Distance()
 * @description finds the distance between two points
 * @param {Point} point1 the first point
 * @param {Point} point2 the second point
 * @returns the distance between the two points
 */
export function Distance(point1, point2) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
}

/**
 * rotatePoint()
 * @description rotates a point around a center point
 * @param {Point} point the point to rotate
 * @param {Point} center the center to rotate the point around
 * @param {Degrees} angle the angle in degrees
 * @returns the new point
 */
export function rotatePoint(point, center, angle) {
  var cosTheta = Math.cos(angle * Math.PI / 180);
  var sinTheta = Math.sin(angle * Math.PI / 180);
  var xPrime = (point.x - center.x) * cosTheta - (point.y - center.y) * sinTheta + center.x;
  var yPrime = (point.x - center.x) * sinTheta + (point.y - center.y) * cosTheta + center.y;
  return {x: xPrime, y: yPrime};
}


// from chatgpt
/**
 * rotatePoint()
 * @description rotates a list of points around a center point
 * @param {Array[Point]} points the points to rotate
 * @param {Point} center the center to rotate the points around
 * @param {Degrees} angle the angle in degrees
 * @returns the new point
 */
export function rotatePoints(points, center, angle) {
  var cosTheta = Math.cos(angle * Math.PI / 180);
  var sinTheta = Math.sin(angle * Math.PI / 180);
  var rotatedPoints = [];
  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    var x = point.x;
    var y = point.y;
    var xPrime = (x - center.x) * cosTheta - (y - center.y) * sinTheta + center.x;
    var yPrime = (x - center.x) * sinTheta + (y - center.y) * cosTheta + center.y;
    rotatedPoints.push({x: xPrime, y: yPrime});
  }
  return rotatedPoints;
}
