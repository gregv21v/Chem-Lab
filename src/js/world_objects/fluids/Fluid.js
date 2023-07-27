import Rect from "../../shapes/Rect";
import Drop from "./Drop";

/**
 * Fluid - a fluid is a gas or a liquid
 */
export default class Fluid {
    /**
     * constructor()
     * @description constructs the fluid
     * @param {String} name the name of the fluid
     * @param {Number} density the density of the fluid
     * @param {Number} volume the volume of the fluid
     * @param {Color} color the color of the fluid
     */
    constructor(name, density, heatedDensityMultiplier, color) {
        this._color = color; // the color of the fluid
        this._name = name; // the name of the fluid
        this._density = density; // the density of the fluid
        this._heatedDensityMultiplier = heatedDensityMultiplier
        this._boilingPoint = 50 // the point at which this fluid turns to gas
    }

    /**
     * mix()
     * @description average the two fluids together.
     */
    static mix(fluid1, fluid2) {
        return new Fluid(
            Math.floor((fluid1.value + fluid2.value) / 2),
            {
                red: Math.floor((fluid1.color.red + fluid2.color.red) / 2),
                green: Math.floor((fluid1.color.green + fluid2.color.green) / 2),
                blue: Math.floor((fluid1.color.blue + fluid2.color.blue) / 2)
            }
        )
    }

    /**
     * getColorAsString()
     * @returns the getColorAsString of the fluid
     */
    getColorAsString() {
        return "rgba(" + this._color.red + "," + this._color.green + "," + this._color.blue + "," + this._color.alpha + ")";
    }

    /**
     * get name()
     * @description gets the name for this fluid
     */
    get name() {
        return this._name;
    }

    /**
     * get density()
     * @description gets the density of the fluid
     */
    get density() {
        return this._density
    }

    /**
     * get heatedDensityMultiplier()
     * @description gets the heatedDensityMultiplier of the fluid
     */
    get heatedDensityMultiplier() {
        return this._heatedDensityMultiplier
    }

    /**
     * get color()
     * @description gets the density of the fluid
     */
    get color() {
        return this._color
    }

    
}