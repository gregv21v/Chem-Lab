// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


/*
  Gets the opposite of the given side
*/
function getOpposite(side) {

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
  } else {
    return ""
  }

}
