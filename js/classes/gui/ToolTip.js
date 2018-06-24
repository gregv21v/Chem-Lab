/*
  Displays instructions on how to play the game

*/
function ToolTip(position, radius, tip) {
  GameObject.call(this, position)

  this.tip = tip
  this.position = position
  this.radius = radius

  var mainSVG = d3.select("body").select("svg")
  this.svg = {
    tipRect: mainSVG.append("rect"),
    tipText: mainSVG.append("text"),
    hoverCircle: mainSVG.append("circle")
  }


}

ToolTip.prototype.createSVG = function () {

  var self = this;

  this.svg.tipText.attr("x", this.position.x)
                  .attr("y", this.position.y)
                  .text("")

  this.svg.tipRect.attr("x", this.position.x)
                  .attr("y", this.position.y - 20)
                  .attr("width", 100)
                  .attr("height", 50)
                  .style("fill", "white")


  // hover circle
  // whenever a mouse enters this circle,
  // hover over it.
  this.svg.hoverCircle.attr("cx", this.position.x)
                      .attr("cy", this.position.y)
                      .attr("r", this.radius)
                      .style("fill-opacity", "0")
                      .on("mouseover", function() {
                        self.svg.tipText.text(self.tip)
                        self.svg.tipRect.attr("width", 100)
                      })
                      .on("mouseout", function() {
                        self.svg.tipText.text("")
                        self.svg.tipRect.attr("width", 0)
                      })

};


ToolTip.prototype.show = function () {
  this.svg.tipText.text(this.tip)
};

ToolTip.prototype.hide = function() {
  this.svg.tipText.text("")
}
