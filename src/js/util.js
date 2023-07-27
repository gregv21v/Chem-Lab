// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


/*
  Gets the opposite of the given side
*/
export function getOpposite(side) {
  
  if(side === "left") {
    return "right"
  } else if(side === "right") {
    return "left"
  } else if(side === "up") {
    return "down"
  } else if(side === "down") {
    return "up"
  } else if(side === "top") {
    return "bottom"
  } else if(side === "bottom") {
    return "top"; 
  } else if(side === "start") {
    return "end";
  } else if(side === "end") {
    return "start";
  } else {
    return ""
  }

}

/**
 * getNextSide()
 * @description gets the next side going clockwise
 * @param {side} side the side to get the next side for
 */
export function getNextSide(side) {
  let sideOrder = [
    "left", "up", "right", "down"
  ]
  let currentIndex = sideOrder.indexOf(side)
  return sideOrder[(currentIndex + 1) % sideOrder.length]
}




/**
 * dot()
 * @description gets the dot product of the given vectors
 * @param {Vector} vertex1 the first vertex
 * @param {Vector} vertex2 the second vertex
 * @returns the dot product of the two vertices
 */
export function dot(vertex1, vertex2) {
	return vertex1.x * vertex2.x + vertex1.y * vertex2.y;
}

/**
 * normalize()
 * @description normalizes a vector
 * @param {Vector} vector the vector to normalize
 * @returns the normalization vector
 */
export function normalize(vector) {
	let length = Math.sqrt(
    vector.x * vector.x + vector.y * vector.y
  )
  return {
  	x: vector.x / length,
    y: vector.y / length
  }
}

/**
 * overlap()
 * @description checks if two projections overlap
 * @param {Projection} proj1 the first projection
 * @param {Projection} proj2 the second projection
 * @returns true if both projections overlap
 *          otherwise false
 */
export function overlap(proj1, proj2) {
	return (
  	(proj1.min < proj2.min && proj2.min < proj1.max) ||
    (proj1.min < proj2.max && proj2.max < proj1.max) ||
    (proj2.min < proj1.min && proj1.min < proj2.max) ||
    (proj2.min < proj1.max && proj1.max < proj2.max)
  )
}

/**
 * project()
 * @description projects a shape on to an axis
 * @param {Shape} shape the shape to project
 * @param {Axis} axis the axis to project onto   
 * @returns the projection
 */
export function project(shape, axis) {
	let normalizedAxis = normalize(axis)
	let vertices = shape.toPoints()
  let min =  dot(normalizedAxis, vertices[0]);
  let max = min;
  for (let i = 1; i < vertices.length; i++) {
    // NOTE: the axis must be normalized to get accurate projections
    let p = dot(normalizedAxis, vertices[i]);
    if (p < min) {
      min = p;
    } else if (p > max) {
      max = p;
    }
  }
  return {
  	min, max
  };
}

/**
 * getAreaOfIntersection()
 * @description finds the area of intersection between the two rectangles
 * @param {Rect} rect1 the first rectangle
 * @param {Rect} rect2 the second rectangle
 * @returns the area of intersection of the two rectangles
 */
export function getAreaOfIntersection(rect1, rect2) {  
  console.log(rect1, rect2);
  return Math.max(
  		0, 
      Math.min(rect1.position.x + rect1.width, rect2.position.x + rect2.width)
      - Math.max(rect1.position.x, rect2.position.x)
   ) * Math.max(
    	0, 
      Math.min(rect1.position.y + rect1.height, rect2.position.y + rect2.height) 
      - Math.max(rect1.position.y, rect2.position.y)
   )
}