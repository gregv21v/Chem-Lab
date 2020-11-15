/*
  Faucet

  Releases liquid drops back out into the environment from a Pipe
  or tank.

  position: the upper left hand corner of the faucet
    in the world

  width: the width of the faucet coming from the upper left hand
    corner to the connection from the spout

  height: the height of the spout of the pipe

  diameter: the inner diameter of the pipe

*/
class Faucet extends Snappable {
  constructor(position, width, height, diameter) {
    super(position)

    // order helps determine visual appearance, so don't
    // mess with the order
    var mainSVG = d3.select("body").select("svg")
    this.svg = {
      downwardPipeWalls: mainSVG.append("rect"),
      upperPipeWalls: mainSVG.append("rect"),
      downwardPipeInterior: mainSVG.append("rect"),
      upperPipeInterior: mainSVG.append("rect"),
      nob: mainSVG.append("rect"),
      valve: mainSVG.append("rect")
    }

    var center = {
      x: position.x + width/2,
      y: position.y + height/2
    }

    this.opened = false;
    this.position = position;
    this.width = width;
    this.height = height;

    // use to estimate the flow rate
    // of liquids through a tube.
    this.diameter = diameter;

    this.wallThickness = 5;
    this.nobWidth = 10; // 10 means open, 5 means closed

    this.closedNobWidth = 5;
    this.openedNobWidth = 10;


  }

  open() {
    this.opened = true;

    this.updateNobSVG();
  };

  close() {
    this.opened = false;

    this.updateNobSVG();
  };





  createSVG() {

  	this.updateSVG();

    // Create the upper rectangle that makes
    // up the outer walls of the faucet.

  };


  updateSVG() {
    this.svg.upperPipeWalls.attr("x", this.position.x)
                  .attr("y", this.position.y)
                  .attr("width", this.width)
                  .attr("height", this.diameter + 2 * this.wallThickness)
                  .style("fill", "black")

    this.svg.upperPipeInterior.attr("x", this.position.x)
                      .attr("y", this.position.y + this.wallThickness)
                      .attr("width", this.width - this.wallThickness)
                      .attr("height", this.diameter)
                      .style("fill", "white")

    this.svg.downwardPipeWalls.attr("x",
                              this.position.x
                              + this.width
                              - (this.diameter + this.wallThickness * 2))
                      .attr("y", this.position.y)
                      .attr("width", this.diameter + this.wallThickness * 2)
                      .attr("height", this.height)
                      .style("fill", "black")

    this.svg.downwardPipeInterior.attr("x",
                              this.position.x
                              + this.width
                              - (this.diameter + this.wallThickness))
                      .attr("y", this.position.y + this.wallThickness)
                      .attr("width", this.diameter)
                      .attr("height", this.height - this.wallThickness)
                      .style("fill", "white")


    // the nob should be located right below the
    // the upper pipe on the downward pipe
    this.updateNobSVG();

  };

  toggle() {
    if(this.opened) {
      this.opened = false;
      this.nobWidth = this.closedNobWidth;
      this.svg.nob.attr("height", this.nobWidth)
                  .attr("y",
                    this.position.y
                      + this.diameter
                      + 2 * this.wallThickness
                      - this.nobWidth/2)
      this.svg.valve.attr("width", this.diameter)
    } else {
      this.opened = true;
      this.nobWidth = this.openedNobWidth;
      this.svg.nob.attr("height", this.nobWidth)
                  .attr("y",
                    this.position.y
                      + this.diameter
                      + 2 * this.wallThickness
                      - this.nobWidth/2)
      this.svg.valve.attr("width", 0)
    }
  };


  updateNobSVG() {

    var self = this;

    // the nob should be located right below the
    // the upper pipe on the downward pipe
    // nob starts closed
    this.svg.nob.attr("x", this.position.x + this.width)
      .attr("y", this.position.y + this.diameter + 2 * this.wallThickness - this.nobWidth/2)
      .attr("width", 5)
      .attr("height", this.nobWidth)
      .style("fill", "black")
      .on("click", function() {
        self.toggle();
      });

    this.svg.valve.attr("x", this.position.x + this.width - this.diameter - this.wallThickness)
      .attr("y", this.position.y + this.diameter + 2 * this.wallThickness + 5/2)
      .attr("width", this.diameter)
      .attr("height", 5)
      .style("fill", "black")

  };

}
