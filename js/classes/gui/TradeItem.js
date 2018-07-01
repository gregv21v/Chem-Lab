/*
  A single slot of the inventory
*/

function TradeItem(position, width, height, owner, sellValue, purchaseValue) {
  BorderedButton.call(this, position, width, height);

  this.sellValue = sellValue;
  this.purchaseValue = purchaseValue;
  this.owner = owner;

  this.btnWidth = 60;
  this.btnHeight = 20;
  this.offset = 20;

  this.buyBtn = new Button(
    {
      x: this.position.x + width - this.btnWidth * 2 - this.offset,
      y: this.position.y + height/2 - this.btnHeight/2
    },
    this.btnWidth, // width
    this.btnHeight // height
  )
  this.buyBtn.setFill({color: "green", opacity: 1})
  this.buyBtn.setText("Buy");
  this.sellBtn = new Button(
    {
      x: this.position.x + width - this.btnWidth - this.offset,
      y: this.position.y + height/2 - this.btnHeight/2
    },
    this.btnWidth, // width
    this.btnHeight // height
  )
  this.sellBtn.setFill({color: "red", opacity: 1})
  this.sellBtn.setText("Sell");
  this.index = 0;
}

TradeItem.prototype = Object.create(BorderedButton.prototype)
TradeItem.prototype.constructor = TradeItem


TradeItem.prototype.changeOwner = function () {

};

TradeItem.prototype.createSVG = function () {
  // How do you call the createSVG function
  //  from the Superclass?
  this.createBackgroundSVG()
	this.createTextSVG()
  this.sellBtn.createSVG();
  this.buyBtn.createSVG();
	this.createOverlaySVG()


};
