/*
  The Player object stores all the relavent information about the player
  including items that he has in the store, and in the world.
*/

function Player()
{
  var svg = document.querySelector("svg");
  var height = svg.getAttribute("height") - 30;
  var self = this;

  this.hand = null;

  this.world = new World(this, {x: 270, y: 20}, svg.getAttribute("width") - (270 + 400), height);
  this.inventory = new Inventory(this, {x: 20, y: 45}, 250, height - 25);
  this.credits = new ValueBox({x: 20, y: 20}, 250, 25);
  this.credits.setFill({color: "red"})
  this.credits.setTextFill({color: "black"})
  this.credits.setStroke({color: "black", width: 10})
  this.credits.setLabel("Coins");
  this.credits.setValue(0)

  // add example items to the players inventory

  this.inventory.add(new Valve(
    {
      x: this.inventory.getWidth() + this.world.getWidth()/2,
      y: this.world.getHeight()/2
    },
    20,
    10,
    5
  ));
  this.inventory.add(new Tank({x: 475, y: 540}, {width: 40, height: 100}, 5));
  this.inventory.add(new Tank({x: 475, y: 540}, {width: 40, height: 100}, 5));
  this.inventory.add(new Tank({x: 475, y: 540}, {width: 40, height: 100}, 5));
  this.inventory.add(new Tank({x: 475, y: 540}, {width: 40, height: 100}, 5));

  var newPipe = new Pipe({x: 500, y: 500}, 100, 10, 5)
  this.inventory.add(newPipe);



  this.sellBtn = new Button(
    {
      x: this.inventory.getWidth() + this.world.getWidth()/2 - 99 /* half the width of button */,
      y: this.world.getHeight() - 35 /* Space for the button */
    },
    208,
    30
  );
  this.sellBtn.setText("Sell");
  this.sellBtn.setFill({color: "red"});
  this.sellBtn.setStroke({color: "blue", width: 2})


  // positioned sell tank at center of world.
  var sellTank = new Tank(
    {
      x: this.inventory.getWidth() + this.world.getWidth()/2 - 100,
      y: this.inventory.getHeight() - 50 - 5 /* Space for the button */
    },
    {
      width: 200,
      height: 40
    },
    5
  );
  sellTank.wallColor = "red";


  this.sellBtn.setOnClick(function() {
    console.log("Sold");

    // get the liquid from the tank
    var liquid = sellTank.getLiquid();
    console.log(liquid);

    // empty the tank
    sellTank.empty();

    self.credits.value += liquid.amount * liquid.type.value;
    self.credits.updateText();
    self.credits.createSVG();

  })

  var startPump = new Pump(this.world, {x: 0, y: 0}, 10);
  startPump.position.x = this.inventory.getWidth() + this.world.getWidth()/2 - startPump.getWidth()/2;
  startPump.position.y = startPump.getWidth() + startPump.production;

  /*var testFaucet = new Faucet({
    x: this.inventory.getWidth() + this.world.getWidth()/2 - 100,
    y: 50
  }, 50, 40, 10)*/



  this.world.add(sellTank);
  this.world.add(startPump);
  //this.world.add(testFaucet);


}

Player.prototype.update = function () {
  var self = this;
  setInterval(function() {
    self.world.update();
  }, 20);
};

Player.prototype.createSVG = function () {

  this.inventory.createSVG();
  this.world.createSVG();
  this.sellBtn.createSVG();
  this.credits.createSVG();

  // show-hide snap areas
  //this.world.showSnapAreas();
};
