/**
 * Chemical - a chemical that you can put in a tank
 */
export default class Chemical {
    /**
     * constructor()
     * @description constructs the chemical
     * @param {number} volume the volume of the chemical
     * @param {Color} color the color of the chemical
     */
    constructor(volume, color) {
        this._volume = volume;
        this._color = color;
        this._uid = ""
    }


}