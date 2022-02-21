import Rect from "./shapes/Rect";

/**
 * Fluid - a fluid is a gas or a liquid
 */
export default class Fluid {
    /**
     * constructor()
     * @description constructs the chemical
     * @param {String} name the name of the fluid
     * @param {Number} density the density of the fluid
     * @param {Number} volume the volume of the chemical
     * @param {Color} color the color of the chemical
     */
    constructor(name, density, volume, color) {
        this._volume = volume;
        this._color = color;
        this._name = name;
        this._density = density;
        this._rect = new Rect();

        this._rect.fill = {
            opacity: 1,
            color: this.fill()
        }
        this._rect.stroke = {
            width: 0,
            color: this.fill()
        }
    }

    /**
     * clone()
     * @description clones the Fluid
     */
    clone() {
        return new Fluid(this._name, this._density, this._volume, this._color)
    }

    /**
     * get name()
     * @description gets the name for this fluid
     */
    get name() {
        return this._name;
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
     * get density()
     * @description gets the density of the fluid
     */
    get density() {
        return this._density
    }

    /**
     * fill()
     * @returns the fill of the fluid
     */
    fill() {
        return "rgb(" + this._color.red + "," + this._color.green + "," + this._color.blue + ")";
    }

    /**
     * updateRect() 
     * @description create a rect to fill a tank with the fluid
     * @param {Point} position the position of the rect
     * @param {Number} width the width of the tank
     */
    updateRect(position, width) {
        this._rect.width = width;
        this._rect.height = this._volume / width;
        this._rect.position = position;
    }

    /**
     * render()
     * @description renders the svg for the fluid
     */
    render(parent) {
        this._rect.render(parent);
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

    
}