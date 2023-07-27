/**
 * ContainerFluidBody - a body of fluid
 */
import FluidBody from "./FluidBody";
import Drop from "./Drop";
import * as d3 from "d3"

export default class ContainerFluidBody extends FluidBody {
    /**
     * constructor()
     * @description constructs the fluid
     * @param {Container} container the container that the fluid is contained in
     * @param {Number} volume the volume of the fluid
     * @param {Fluid} fluid the fluid that this mass is made of 
     */
    constructor(layer, position, width, height, volume, fluid) {
        super(layer, position, width, height, {x: 0, y: 0}, volume, fluid)
    }

    /**
     * create()
     * @description creates the svg for the fluid
     */
    create() {
        super.create();
        this.fill.color = this._fluid.getColorAsString()
        this.update();  
    }





    /**
     * update()
     * @description updates the ContainerFluidBody
     */
    update() {
		this._svg.rect.attr("width", this.width);
		this._svg.rect.attr("height", this.height);
		this._svg.rect.attr("x", this._position.x);
		this._svg.rect.attr("y", this._position.y);
		this._svg.rect.attr("stroke-width", this._stroke.width);
		this._svg.rect.attr("stroke", this._stroke.color);
		this._svg.rect.attr("stroke-opacity", this._stroke.opacity)
		this._svg.rect.attr("fill", this._fill.color);
		this._svg.rect.attr("fill-opacity", this._fill.opacity);
	}
    /**
	 * removeDrop()
	 * @description removes a drop from the tank of size size
	 * @param {Number} size the size of the drop
	 * @returns a drop of size size 
	 */
	removeDrop (size) {
        if(this.volume <= 0) {
            return null;
        } else if(size * size <= this.volume) {
			this.volume -= size * size;
            let newDrop = new Drop(d3.select("[name='fluids']"), {x: 0, y: 0}, {x: 0, y: 0}, size, this.fluid);
            newDrop.create()
			return newDrop;
		} else {
            let dropSize = Math.round(Math.sqrt(this.volume))
            this.volume -= dropSize * dropSize
            let newDrop = new Drop(d3.select("[name='fluids']"), {x: 0, y: 0}, {x: 0, y: 0}, dropSize, this.fluid);
            newDrop.create()
            return newDrop;
        }
	}

    /**
     * expand()
     * @description expands the fluid due to tempature. Use a fraction to contract the fluid
     * @param {Number} amount amount to expand
     */
    expand(amount) {
        this._volume = this._volume * amount;
    }


   

    /**
     * addDrop()
     * @description add a drop to the fluid
     * @param {Number} size the size of the drop to add
     */
    addDrop(size) {
        this.volume += size * size;
    }

    /**
     * clone()
     * @description clones the Fluid
     */
    clone() {
        return new ContainerFluidBody(this.position, this.volume, this.fluid)
    }


    /**
     * set container()
     * @description sets the container of this fluid
     */
    set container(value) {
        this._container = value;
    }

    /**
     * getButtomY() 
     * @description gets the y position at the bottom
     */
    getButtomY()  {
        return this._position.y + this.height
    }

    /**
     * get width()
     * @description gets the width of this Fluid   
     * @returns the width of this Fluid
     */
    get width() {
        return this._container.interiorWidth;
    }

    /**
     * get height()
     * @description gets the hight of this Fluid
     * @returns height
     */
    get height() {
        return this._volume / this._container.interiorWidth;
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