/*
  A single slot of the inventory
*/

import BorderedButton from "./buttons/BorderedButton";
import Button from "./buttons/Button";

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

    this._sellValue = sellValue;
    this._purchaseValue = purchaseValue;
    this._owner = owner;

    var btnWidth = 100;
    var btnHeight = 20;
    this._sellBtn = new Button(
      {
        x: this._position.x + width - 50 - 20,
        y: this._position.y + height/2 - 20/2
      },
      btnWidth, // width
      btnHeight // height
    )

    this.index = 0;
  }


  /**
   * create()
   * @description create the graphics for the TradeItem 
   * @param {SVG} parent the parent svg to attach the TradeItem to
   */
  create(parent) {
    this._sellBtn.create(parent);

    this._sellBtn.styling = {
      color: "blue",
      opacity: 1
    }

    this._sellBtn.text = "Sell"
  }

}
