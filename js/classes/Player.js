/*
  The Player object stores all the relavent information about the player
  including items that he has in the store, and in the world.
*/

class Player {
  constructor() {
    var svg = d3.select("body").select("svg")
    svg
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)
    var height = svg.attr("height");
    var width = svg.attr("width");
    var margin = 20
    var borderWidth = 5

    var self = this;

    this.hand = null;

    this.world = new World(
      this, {x: 250 + margin, y: margin}, width - (250 + margin * 2), height - 2*(margin));
    this.inventory = new Inventory(
      this, {x: margin, y: margin * 2 + borderWidth}, 250, height - 2*(margin + 10));
    this.credits = new ValueBox({x: margin, y: margin}, 250, 25);
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
    this.inventory.add(new Tank({x: 0, y: 0}, 50, 70, 5));
    this.inventory.add(new Tank({x: 0, y: 0}, 50, 70, 5));
    this.inventory.add(new Tank({x: 0, y: 0}, 50, 70, 5));
    this.inventory.add(new Tank({x: 0, y: 0}, 50, 70, 5));

    var newPipe = new Pipe({x: 500, y: 500}, 20, 100, 5)
    this.inventory.add(newPipe);

    var newPipe2 = new ElbowPipe({x: 500, y: 500}, 20, 50, 5)
    this.inventory.add(newPipe2);



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
        x: this.inventory.getWidth() + this.world.getWidth()/2 - 100, /* border width of sell button */
        y: this.world.getHeight() - 85 // Space for the button
      },
      200,
      40,
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

    var testValve = new Valve(
      {x: this.world.getWidth() / 2, y: this.world.getHeight() / 2},
      100, // width
      10, // interiorHeight
      5  // wallWidth
    )
    //testValve.showSnapAreas();

    /*var testFaucet = new Faucet({
      x: this.inventory.getWidth() + this.world.getWidth()/2 - 100,
      y: 50
    }, 50, 40, 10)*/



    this.world.add(sellTank);
    this.world.add(startPump);
    //this.world.add(testValve)
    //this.world.add(testFaucet);
  }


  update() {
    var self = this;
    setInterval(function() {
      self.world.update();
    }, 20);
  };

  createSVG() {

    this.inventory.createSVG();
    this.world.createSVG();
    this.sellBtn.createSVG();
    this.credits.createSVG();

    // show-hide snap areas
    //this.world.showSnapAreas();
  };

}
