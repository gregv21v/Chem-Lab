/*
  A single slot of the inventory
*/

import BorderedButton from "./buttons/BorderedButton";
import Button from "./buttons/Button";
import * as d3 from "d3"

export default class TradeItem extends BorderedButton {
  /**
   * constructor()
   * @description constructs the TradeItem
   * @param {Point} position position of the TradeItem
   * @param {Number} width the width of the TradeItem
   * @param {Number} height the height of the TradeItem
   * @param {Player} owner the player who owns the item
   * @param {Number} sellValue the value the TradeItem can be sold for 
   * @param {Number} purchaseValue the value the TradeItem can be purchased for
   */
  constructor(position, width, height, owner, sellValue, purchaseValue) {
    super(position, width, height);

    this.sellValue = sellValue;
    this.purchaseValue = purchaseValue;
    this.owner = owner;

    var btnWidth = 100;
    var btnHeight = 20;
    this.sellBtn = new Button(
      {
        x: this._position.x + width - 50 - 20,
        y: this._position.y + height/2 - 20/2
      },
      btnWidth, // width
      btnHeight // height
    )

    this.sellBtn.create(d3.select("svg"))

    this.sellBtn.styling = {
      color: "blue",
      opacity: 1
    }

    this.sellBtn.text = "Sell"
    this.index = 0;
  }

}
