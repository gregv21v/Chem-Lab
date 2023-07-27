/**
 * FluidBody - a body of fluid
 */

import GameObject from "../GameObject";
import Rect from "../../shapes/Rect";
import * as d3 from "d3"

export default class FluidBody extends Rect {
    /**
     * constructor()
     * @description constructs the fluid
     * @param {Vector} position the position of the fluid
     * @param {Vector} velocity the velocity of the fluid
     * @param {Number} volume the volume of the fluid
     * @param {Fluid} fluid the fluid that this mass is made of 
     */
    constructor(layer, position, width, height, velocity, volume, fluid) {
        super(layer, position, width, height)
        this._volume = volume;
        this._fluid = fluid;
        this._velocity = velocity;
        this._temperature = 0 // the current temperature of the fluid
    }


    /**
     * clone()
     * @description clones the Fluid
     */
    clone() {
        return new FluidBody(this.position, this.velocity, this.volume, this.fluid)
    }


    /**
     * heat()
     * @description heat the Fluid
     * @param {Number} the amount of heat to apply to the fluid body
     */
    heat(temperature) {
        this._temperature += temperature;
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
     * get width()
     * @description gets the width of this Fluid   
     * @returns the width of this Fluid
     */
    get width() {
        return this._width;
    }

    /**
     * get height()
     * @description gets the hight of this Fluid
     * @returns height
     */
    get height() {
        return this._height;
    }

    /**
     * get fluid()
     * @description gets the fluid for this FluidBody
     */
    get fluid() {
        return this._fluid;
    }

 

    /**
     * set volume()
     * @description sets the volume of the fluid
     * @param {Number} value the value to set the volume to
     */
    set volume(value) {
        if(value < 0) {
            this._volume = 0;
        } else {
            this._volume = value;
        }
    }

    /** 
     * get volume()
     * @description get the volume of the fluid
     */
    get volume() {
        return this._volume;
    }
    
}