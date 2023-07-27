
/**
 * Fan - the graphic for the fan
 */
export default class Fan extends Shape {

    constructor(layer, position, width) {

    }


    create() {
        this._svg = this._layer.append("path")

        this.update();
    }
}