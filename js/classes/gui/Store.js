/*
  A place where a player can purchase, and sell his or her
  items.

*/
function Store() {

  this.forSaleItems = []; // the items available that the player can
                          // buy
  this.sellableItems = []; // the players own items that he or she can sell


}

Inventory.prototype = Object.create(Inventory.prototype)
Inventory.prototype.constructor = Inventory


Store.prototype.createSVG = function () {

  // display the buyable items


  // display the sellable items
};
