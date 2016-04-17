/*

*/

function Player()
{
  var svg = document.querySelector("svg");
  var height = 700;
  var self = this;

  this.hand = null;
  this.credits = 0;

  this.world = new World(this, {x: 270, y: 20}, svg.getAttribute("width") - (270 + 400), height);
  this.inventory = new Inventory(this, {x: 20, y: 20}, 250, height);

  // add example items to the players inventory
  this.inventory.add(new Tank({x: 475, y: 540}, {width: 40, height: 100}, 5));
  this.inventory.add(new Tank({x: 475, y: 540}, {width: 40, height: 100}, 5));
  this.inventory.add(new Tank({x: 475, y: 540}, {width: 40, height: 100}, 5));
  this.inventory.add(new Tank({x: 475, y: 540}, {width: 40, height: 100}, 5));
  this.inventory.add(new Pipe({x: 500, y: 500}, 100, 10, 5));

  this.sellBtn = new Button(
    {
      x: this.inventory.getWidth() + this.world.getWidth()/2 - 99 /* half the width of button */,
      y: this.inventory.getHeight() - 25 /* Space for the button */
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
      y: this.inventory.getHeight() - 50 - 20 /* Space for the button */
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

    self.credits += liquid.amount * liquid.type.value;
    console.log(self.credits);

  })

  var startPump = new Pump(this.world, {x: 0, y: 0}, 10);
  startPump.position.x = this.inventory.getWidth() + this.world.getWidth()/2 - startPump.getWidth()/2;
  startPump.position.y = startPump.getWidth() + startPump.production;

  this.world.add(sellTank);
  this.world.add(startPump);


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

  // show-hide snap areas
  //this.world.showSnapAreas();
};
