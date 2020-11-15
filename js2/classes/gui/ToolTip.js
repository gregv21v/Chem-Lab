/*
  Displays instructions on how to play the game

*/
function ToolTip(position, tip) {

  this.tip = tip
  this.position = position
  this.visible = false

  var mainSVG = d3.select("body").select("svg")
  this.svg = {
    tipRect: mainSVG.append("rect"),
    tipText: mainSVG.append("text")
  }


}

ToolTip.prototype.createSVG = function () {

  var self = this;

  this.svg.tipText.attr("x", this.position.x)
                  .attr("y", this.position.y)
                  .text("")
                  .style("display", "none")

  this.svg.tipRect.attr("x", this.position.x)
                  .attr("y", this.position.y - 20)
                  .attr("width", 0)
                  .attr("height", 50)
                  .style("fill", "white")
                  .style("fill-opacity", 0.7)
                  .style("display", "none")




};


ToolTip.prototype.show = function () {
  this.svg.tipRect.attr("width", 100)
  this.svg.tipText.text(this.tip)
};

ToolTip.prototype.hide = function() {
  this.svg.tipRect.attr("width", 0)
  this.svg.tipText.text("")
}
