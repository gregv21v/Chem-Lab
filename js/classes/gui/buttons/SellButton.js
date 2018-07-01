/*
  A button with a border around it

*/

function SellButton(position, width, height, credits, sellTank) {

  Button.call(this, position, width, height);
  this.credits = credits
  this.sellTank = sellTank
  this.enabled = true;
}

SellButton.prototype = Object.create(Button.prototype)
SellButton.prototype.constructor = SellButton



// override the on click function
SellButton.prototype.onClick = function () {
  console.log("Sold");

  // get the liquid from the tank
  var liquid = this.sellTank.getLiquid();
  console.log(liquid);

  // empty the tank
  this.sellTank.empty();

  this.credits.value += liquid.amount * liquid.type.value;
  this.credits.updateText();
  this.credits.createSVG();
};
