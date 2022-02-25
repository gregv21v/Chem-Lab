/*
  GameObject - all other objects stem from this one.

  contains the generic interface for every object.
    createSVG --> creates the svg for the object
    destroySVG --> removes the svg for the object

    snapTo --> snaps one object to another

*/
import Rect from "../shapes/Rect";
import * as d3 from "d3"
import ToolTip from "../gui/ToolTip"

export default class GameObject {

  static lastId = 0; // the last id of a created GameObject
  /**
   * constructor()
   * @description constructs the game object
   * @param {Point} center the center of the game object
   */
  constructor(center, velocity) {
    this._center = center;
    this._position = center;
    this._velocity = velocity;

    this._id = GameObject.lastId
    GameObject.lastId++ 

    /*********
      Visuals
    **********/
    this._group = d3.select("body").select("svg").append("g")
    this.svg = {
      default: this._group.append("circle")
    }

    this.svg.default.attr("name", "GameObject")

    this.tooltip = new ToolTip(
      center,
      20, // radius of hover circle
      ""
    );
  }

  

  updateTooltip() {
    this.tooltip.position = this._position;
  };

  /**
   * createSVG() 
   * @description creates the svg graphics for this GameObject
   */
  createSVG(position) {
    let mainSVG = d3.select("body").select("svg")

    //console.log(mainSVG);

  	this.updateSVG();

  	// add all the svg objects to the world
    let obj = mainSVG.append(this.svg.default.type)

    obj.attr("cx", this._center.x)
      .attr("cy", this._center.y)
      .attr("r", 5)
      .style("fill", "red")

  }

  /**
   * destroySVG()
   * @description destroys the svg for the object
   */
  destroySVG() {
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
   * updateSVG()
   * @description updates the svg graphic for this GameObject
   */
  updateSVG() {

  }

  getLiquidType() {
    return "";
  };

  /**
   * getWidth()
   * @description gets the width of this GameObject   
   * @returns the width of this GameObject
   */
  getWidth() {
    return 0;
  };

  /**
   * getHeight()
   * @description gets the hight of this GameObject
   * @returns height
   */
  getHeight() {
    return 0;
  }


  /**
   * getName()
   * @returns name of this GameObject
   */
  getName() {
    return "";
  }

  /**
    getCenter()
    @description get the center point of this Snappable
  */
  getCenter() {
    return {
      x: this._position.x + this.getWidth() / 2,
      y: this._position.y + this.getHeight() / 2
    }
  }

  /**
   * getRect()
   * @description gets the rectangler bounding box of this game object.
   * @returns the rectangler bounding box of this GameObject
   */
  getRect() {
    return new Rect();
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
