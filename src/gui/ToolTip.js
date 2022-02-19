/*
  Displays instructions on how to play the game

*/
import * as d3 from "d3"

export default class ToolTip {
  /**
   * constructor()
   * @description constructs the tooltip
   * @param {Point} position the position of the tooltip
   * @param {String} tip the description of the tooltip
   */
  constructor(position, tip) {
    this._tip = tip
    this._position = position

    let mainSVG = d3.select("body").select("svg")
    this.svg = {
      tipRect: mainSVG.append("rect"),
      tipText: mainSVG.append("text")
    }
  }


  /**
   * createSVG()
   * @description create the svg for the tooltip
   */
  createSVG() {
    this.svg.tipText.attr("x", this._position.x)
                    .attr("y", this._position.y)
                    .text("")
  
    this.svg.tipRect.attr("x", this._position.x)
                    .attr("y", this._position.y - 20)
                    .attr("width", 0)
                    .attr("height", 50)
                    .style("fill", "white")
                    .style("fill-opacity", 0.7)
  }

  /**
   * show()
   * @description shows the tooltip
   */
  show() {
    this.svg.tipRect.attr("width", 100)
    this.svg.tipText.text(this.tip)
  }

  /**
   * hide()
   * @description hides the tooltip
   */
    hide() {
      this.svg.tipRect.attr("width", 0)
      this.svg.tipText.text("")
    }
}
