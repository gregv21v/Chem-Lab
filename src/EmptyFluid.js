import Fluid from "./Fluid";

/**
 * EmptyFluid - the nothing fluid
 */
export default class EmptyFluid extends Fluid {
    /**
     * constructor()
     * @description constructs the fluid
     * @param {Number} volume the volume of the fluid
     */
    constructor(volume) {
        super("Empty", 0, volume, {red: 256, green: 256, blue: 256})
    }
}