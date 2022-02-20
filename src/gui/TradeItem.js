/*
  A single slot of the inventory
*/

import BorderedButton from "./buttons/BorderedButton";
import Button from "./buttons/Button";

export default class TradeItem extends BorderedButton {
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
    this.sellBtn.setFill({color: "blue", opacity: 1})
    this.sellBtn.setText("Sell");
    this.index = 0;
  }

  createSVG() {
    // How do you call the createSVG function
    //  from the Superclass?
    //BorderedButton.createSVG();

    //this.sellBtn.createSVG();
  };
}
