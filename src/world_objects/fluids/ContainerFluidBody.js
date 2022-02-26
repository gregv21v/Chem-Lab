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
    constructor(position, volume, fluid) {
        super(position, {x: 0, y: 0}, volume, fluid)
    }

    /**
     * create()
     * @description creates the svg for the fluid
     */
    create(parent) {
        this._group = d3.create("svg:g")

        this._svg = {
            rect: this._group.append("rect")
        };

        this._svg.rect.attr("name", "ContainerFluidBody")
        this._svg.rect.style("fill", this._fluid.getColorAsString())

        this.position = this._position

        parent.append(() => this._group.node())
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
            let newDrop = new Drop({x: 0, y: 0}, {x: 0, y: 0}, size, this.fluid);
            newDrop.create(d3.select("svg"))
			return newDrop;
		} else {
            let dropSize = Math.round(Math.sqrt(this.volume))
            this.volume -= dropSize * dropSize
            let newDrop = new Drop({x: 0, y: 0}, {x: 0, y: 0}, dropSize, this.fluid);
            newDrop.create(d3.select("svg"))
            return newDrop;
        }
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

        this._svg.rect.attr("width", this.width);
        this._svg.rect.attr("height", this.height);
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
        return this._container.interior.width;
    }

    /**
     * get height()
     * @description gets the hight of this Fluid
     * @returns height
     */
    get height() {
        return this._volume / this._container.interior.width;
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
        this._rect.width = this.width;
        this._rect.height = this.height;
        this._rect.position = this.position;

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

        this._svg.rect.attr("width", this.width);
        this._svg.rect.attr("height", this.height);
    }

    /** 
     * get volume()
     * @description get the volume of the fluid
     */
    get volume() {

    
        return this._volume;
    }

    
}