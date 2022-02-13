/*
  GameObject: all other objects stem from this one.

  contains the generic interface for every object.
    createSVG --> creates the svg for the object
    destroySVG --> removes the svg for the object

    snapTo --> snaps one object to another

*/
class GameObject {
  constructor(center) {
    this.center = center

    /*********
      Visuals
    **********/
    var mainSVG = d3.select("body").select("svg")
    this.svg = {
      default: mainSVG.append("circle")
    }

    this.tooltip = new ToolTip(
      center,
      20, // radius of hover circle
      "");

    // Open sides that appear visually open
    this.openSides = {
      top: false,
      bottom: false,
      left: false,
      right: false
    }

    // snap parts
    this.snapCenter = {x: 0, y: 0}
    this.snapping = false;
  }

  updateTooltip() {
    this.tooltip.position = this.position;
  };



  /**
   * createSVG() 
   * @description creates the svg graphics for this GameObject
   */
  createSVG() {
    var mainSVG = d3.select("body").select("svg")

    //console.log(mainSVG);

  	this.updateSVG();

  	// add all the svg objects to the world
    var obj = mainSVG.append(this.svg.default.type)

    obj.attr("cx", this.position.x)
      .attr("cy", this.position.y)
      .attr("r", 5)
      .style("fill", "red")

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
      x: this.position.x + this.getWidth() / 2,
      y: this.position.y + this.getHeight() / 2
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

}
