export default class Modal {


    /**
     * @description creates a modal
     * @param {Layer} layer the svg layer that this modal is on. Should be the top
     * @param {Number} width the width of the modal
     * @param {Number} height the height of the modal 
     */
    constructor(layer, width, height) {
        this._layer = layer;
        this._width = width;
        this._height = height;

        this._svg = {
            group: d3.create("svg:g")
        }
    }


    /**
     * addContent()
     * @description adds content to the modal
     * @param {SVGElement} content the content to add to the modal
     */
    addContent(content) {
        this._svg.group.append(content);
    }
}