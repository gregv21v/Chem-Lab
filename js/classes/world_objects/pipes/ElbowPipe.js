class ElbowPipe extends Pipe {
  constructor(position, diameter, lengthFromCorner, wallWidth) {
    super(position, diameter, lengthFromCorner, wallWidth)

    this.diameter = diameter
    this.length = lengthFromCorner
    this.wallWidth = wallWidth
    this.rotation = 0 // there are 4 rotations
  	this.position = position

  	this.drops = [];
  }


  /**
    createSVG()
    @description creates the svg graphic
  */
  createSVG() {
    var mainSVG = d3.select("body").select("svg")

    this.group = mainSVG.append("g")
  	this.svg = {
  		walls1: this.group.append("rect"),
      walls2: this.group.append("rect"),
  		interior1: this.group.append("rect"),
      interior2: this.group.append("rect")
  	}
  }


  /**
    updateSVG()
    @description updates the attributes of the svg graphic
  */
  updateSVG() {
    let size = (this.length + this.diameter + this.wallWidth*2) / 2
    let transformStr = "translate(" + this.position.x + "," + this.position.y + ") "
    transformStr += "rotate(" + this.rotation + "," + size + "," + size + ")"

    this.group
      .attr("transform", transformStr)

    this.svg.walls1
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", this.length)
              .attr("height", this.diameter + this.wallWidth * 2)
              .style("fill", "black")

    this.svg.walls2
              .attr("x", this.length)
              .attr("y", 0)
              .attr("width", this.diameter + this.wallWidth * 2)
              .attr("height", this.length + this.diameter + this.wallWidth*2)
              .style("fill", "black")

    this.svg.interior1
              .attr("x", 0)
              .attr("y", this.wallWidth)
              .attr("width", this.length + this.wallWidth)
              .attr("height", this.diameter)
              .style("fill", "white")

    this.svg.interior2
              .attr("x", this.length + this.wallWidth)
              .attr("y", this.wallWidth)
              .attr("width", this.diameter)
              .attr("height", this.length + this.diameter + this.wallWidth)
              .style("fill", "white")
  }


  getWidth() {
    return this.length + this.diameter + this.wallWidth
  }

  getHeight() {
    return this.length + this.diameter + this.wallWidth
  }

  getName() {
    return "Elbow Pipe"
  }

  updateDrops () {
  	for(var x in this.drops) {
  		if(this.drops[x].drop.canFlow(this, this.drops[x].direction)) {
  			this.drops[x].drop.flow(this, this.drops[x].direction);
  		}
  	}
  }
}
