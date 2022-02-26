/**
 * FluidBody - a body of fluid
 */

import GameObject from "../GameObject";
import Rect from "../../shapes/Rect";
import * as d3 from "d3"

export default class FluidBody extends GameObject {
    /**
     * constructor()
     * @description constructs the fluid
     * @param {Vector} position the position of the fluid
     * @param {Vector} velocity the velocity of the fluid
     * @param {Number} volume the volume of the fluid
     * @param {Fluid} fluid the fluid that this mass is made of 
     */
    constructor(position, velocity, volume, fluid) {
        super(position, velocity)
        this._volume = volume;
        this._fluid = fluid;
        this._rect = new Rect();
    }

    


    

    

    

    /**
     * create()
     * @description renders the svg for the fluid
     */
    create(parent) {
        this._group = d3.create("svg:g")

        this._svg = {
            rect: this._group.append("rect")
        };

        this._svg.rect.attr("name", "drop")

        this.position = this._position;
        this.width = this._width;
        this.height = this._height;


        parent.append(() => this._group.node())
    }

    /**
     * clone()
     * @description clones the Fluid
     */
    clone() {
        return new FluidBody(this.position, this.velocity, this.volume, this.fluid)
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
     * set containerWidth()
     * @description set the container width of this fluid body
     */

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
     * set width()
     * @description sets the width of the FluidBody
     */
    set width(value) {
        this._width = value;

        this._svg.rect.attr("width", this._width);
    }

    /**
     * set height()
     * @description sets the height of the FluidBody
     */
    set height(value) {
        this._height = value;

        this._svg.rect.attr("height", this._height);
    }


    /**
     * get fluid()
     * @description gets the fluid for this FluidBody
     */
    get fluid() {
        return this._fluid;
    }

    /**
     * get rect()
     * @description gets the rect for this fluid
     */
    get rect() {
        
        return this._rect;
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

    /**
	 * set position
	 * @description sets the position of the Drop
	 * @param {Point} value the new position of the Drop
	 */
	set position(value) {
		this._position = value; 

		this._svg.rect.attr("x", this._position.x);
		this._svg.rect.attr("y", this._position.y);
	}

    /**
	 * get position()
	 * @description gets the position of the Drop
	 */
	get position() {
		return this._position
	}

    
}