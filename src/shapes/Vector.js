/**
 * Vector - a 2d vector
 */
 export default class Vector {
    /**
     * constructor()
     * @description constructs the vector
     * @param {Number} x the x component of the vector
     * @param {Number} y the y component of the vector
     */
    constructor(x, y) {
      this._x = x;
      this._y = y;
    }


    /**
     * get x()
     * @description gets the x value of this vector
     * @returns x value of this vector
     */
    get x() {
      return this._x
    }

    /**
     * get y()
     * @description gets the y value of this vector
     * @returns y value of this vector
     */
    get y() {
      return this._y
    }

    /**
     * set x()
     * @description sets the x value of this vector
     * @param {Number} value the value to set the x value to
     */
    set x(value) {
      this._x = value;
    }

    /**
     * set y()
     * @description sets the y value of this vector
     * @param {Number} value the value to set the y value to
     */
    set y(value) {
      this._y = value;
    }

  
    /**
     * distanceTo()
     * @description get the distance from this vector to another
     * @param {Vector} vector the other vector
     */
    distanceTo(vector) {
      return Math.sqrt(Math.pow(this._x - vector._x, 2) + Math.pow(this._y - vector._y, 2))
    }

    /**
     * subtract()
     * @description subtract this point from another
     * @param {Vector} vec the vector to subtract from this vector
     */
    subtract(vec) {
      return new Vector(
        this._x - vec._x,
        this._y - vec._y
      )
    }

    /**
     * add()
     * @description add this point from another
     * @param {Vector} vec the vector to add from this vector
     */
    add(vec) {
      return new Vector(
        this._x + vec._x,
        this._y + vec._y
      )
    }

    /**
     * divide()
     * @description divide this vector by a scalar
     * @param {Number} scalar the scalar to divide this vector by
     */
    divide(scalar) {
      return new Vector(
        this._x / scalar,
        this._y / scalar
      )
    }

    
    /** 
     * normalize()
     * @description normalizes the vector
     */
    normalize() {
        // normalizes the vector giving it a magnitude of 1
        let magnitude = this.magnitude
        this._x /= magnitude
        this._y /= magnitude
        return this;
    }


    /**
     * get magnitude()
     * @description gets the magnitude of the vector
     * @returns the magnitude of the vector
     */
    get magnitude() {
        return Math.sqrt(
            Math.pow(this._x, 2) + Math.pow(this._y, 2)
        )
    }
  }