/*
  Shop - A place where a player can purchase, and sell their
  items.
*/
export default class Shop {

  /**
   * constructor()
   * @description constructs the shop
   */
  constructor() {
    this.forSaleItems = []; // the items available that the player can
                            // buy
    this.sellableItems = []; // the players own items that he or she can sell
  }
}
