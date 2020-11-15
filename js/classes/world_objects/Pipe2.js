import Snappable2 from "./Snappable2.js"

class Pipe2 extends Snappable {

  constructor(center, width, interiorHeight, wallWidth) {
    super(center)

    this.connectedTanks = [];
  	this.wallWidth = wallWidth;
  	this.interiorHeight = interiorHeight;
  	this.position = {x: 0, y: 0}
  	//this.center = center; // position of pipe
  	this.width = width;

  	this.currentLevel = 0;
  	this.drops = [];

  	var mainSVG = d3.select("body").select("svg")
  	this.svg = {
  		walls: mainSVG.append("rect"),
  		interior: mainSVG.append("rect")
  	}

  	this.position = {x: 0, y: 0};
  	this.rect = this.getRect();
  	this.updatePosition();

  }



}
