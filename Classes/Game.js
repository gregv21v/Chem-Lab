/*

*/

function Game()
{
  var svg = document.querySelector("svg");

  this.hand = null;
  this.world = new World(this, {x: 270, y: 20}, svg.getAttribute("width") - (270 + 40), svg.getAttribute("height") - 150);
  this.inventory = new Inventory(this, {x: 20, y: 20}, 250, svg.getAttribute("height") - 150);

  // add example items to the players inventory
  this.inventory.add(new Tank({x: 475, y: 540}, {width: 40, height: 100}, 5));
  this.inventory.add(new Tank({x: 475, y: 540}, {width: 40, height: 100}, 5));
  this.inventory.add(new Tank({x: 475, y: 540}, {width: 40, height: 100}, 5));
  this.inventory.add(new Tank({x: 475, y: 540}, {width: 40, height: 100}, 5));
  this.inventory.add(new Pipe({x: 500, y: 500}, 100, 10, 5));

  var tank = new Tank({x: 475, y: 540}, {width: 100, height: 100}, 5);
  tank.wallColor = "green";

  this.world.add(tank);
  this.world.add(new Pump(this.world, {x: 500, y: 500}, 10));
}

Game.prototype.update = function () {
  var self = this;
  setInterval(function() {
    self.world.update();
  }, 20);
};

Game.prototype.createSVG = function () {
  this.inventory.createSVG();
  this.world.createSVG();

  // show-hide snap areas
  this.world.showSnapAreas();
};
