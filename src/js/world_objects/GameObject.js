/*
  GameObject - all other objects stem from this one.

  contains the generic interface for every object.
    createSVG --> creates the svg for the object
    destroySVG --> removes the svg for the object

    snapTo --> snaps one object to another

*/
import * as d3 from "d3"

export default class GameObject {

  static lastId = 0; // the last id of a created GameObject
  /**
   * constructor()
   * @description constructs the game object
   * @param {Vector} center the center of the game object
   * @param {Vector} velocity the velocity of the game object
   */
  constructor(layer, position, velocity) {
    this._layer = layer; // the layer that the graphic for this game object will be attached to
    this._position = position;
    this._velocity = velocity;
    this._width = 0;
    this._height = 0;

    this._id = GameObject.lastId
    GameObject.lastId++ 
  }

  clone() {
    let clone = new GameObject(this._layer, this._position, this._velocity);
    clone._width = this._width;
    clone._height = this._height;
    clone._id = this._id;

    return clone;
  }

  /**
   * create() 
   * @description creates the graphics for the game object
   * @param {SVG} parent the parent svg
   */
  create() {
    this._group = d3.create("svg:g")

    this._svg = {};
    
    this._layer.append(() => this._group.node())
  }

  /**
   * destroySVG()
   * @description destroys the svg for the object
   */
  destroy() {
    this._group.remove()
  }

  /**
   * update()
   * @description update the GameObject
   */
  update(world) {
    this._position.x += this._velocity.x;
    this._position.y += this._velocity.y;
  } 
  
  /**
   * get id()
   * @description gets the drop id
   * @returns the drops id
   */
  get id() {
    return this._id;
  }


  /**
   * get liquidType()
   * @description gets the liquid type this GameObject is
   */
  get liquidType() {
    return "";
  }

  /**
   * get width()
   * @description gets the width of this GameObject   
   * @returns the width of this GameObject
   */
  get width() {
    return 0;
  };

  /**
   * get height()
   * @description gets the hight of this GameObject
   * @returns height
   */
  get height() {
    return 0;
  }


  /**
   * get name()
   * @returns name of this GameObject
   */
  get name() {
    return "";
  }

  /**
    getCenter()
    @description get the center point of this Snappable
  */
  get center() {
    return {
      x: this._position.x + this.width / 2,
      y: this._position.y + this.height / 2
    }
  }

  /**
   * get position()
   * @description returns the position of the game object
   */
  get position() {
    return this._position;
  }

  /**
   * set position()
   * @description sets the position of the game object
   */
  set position(value) {
    this._position = value;
  }


}
