

import * as d3 from "d3"
/**
 * MultiLineText - text that extends multiple lines
 */
export default class MultiLineText {

    /**
     * constructor()
     * @description constructs the MultiLineText object
     * @param {Array[String]} lines the lines of text
     * @param {Point} position the position of the text
     */
    constructor(layer, lines, position) {
        this._layer = layer;
        this._lines = lines;
        this._position = position;
    }

    /**
     * create()
     * @description creates the MultiLineText object
     */
    create() {
        this._group = d3.create("svg:g")
        this._layer.append(() => this._group.node())

        this._group.attr("name", "MultiLineText")

        this.styling = {
            textColor: "black",
            textSize: 12
        }

        this._svg = [];
        for (let i = 0; i < this._lines.length; i++) {
            let svgLine = this._group.append("text")
            this._svg.push(svgLine)
            svgLine.attr("x", this._position.x)
            svgLine.attr("y", this._position.y + (this.styling.textSize + 5) * i)
            svgLine.style("fill", this.styling.textColor)
            svgLine.text(this._lines[i])
        }


        
    }

    /**
     * set text()
     * @description sets the text value
     * @param {Array[String]} value the text value
     */
    set text(value) {
        this._lines = value;

        console.log(this._lines);

        for (let i = 0; i < this._lines.length; i++) {
            let svgLine;
            // the svgs already exist
            if(i < this._svg.length) { 
                svgLine = this._svg[i];
                svgLine.text(this._lines[i])
            } else { // the svgs don't exist
                svgLine = this._group.append("text")
                this._svg.push(svgLine);
                svgLine.attr("x", this._position.x)
                svgLine.attr("y", this._position.y + (this.styling.textSize + 5) * i)
                svgLine.style("fill", this.styling.textColor)
                svgLine.text(this._lines[i])
            }
        }

        // remove any unused lines
        if(this._svg.length > this._lines.length) {
            for (var i = this._svg.length - this._lines.length; i < this._svg.length; i++) {
                let svgLine = this._svg[i];
                svgLine.remove();
            }
        }
    }


    /**
     * set position()
     * @description sets the position of the MultiLineText 
     * @param {Point} value the position of the MultiLineText
     */
    set position(value) {
        this._position = value;

        for (let i = 0; i < this._svg.length; i++) {
            let svgLine = this._svg[i];
            svgLine.attr("x", this._position.x)
            svgLine.attr("y", this._position.y + (this.styling.textSize + 5) * i)
        }
    }
}