/*
  On a very basic level, every object consists of it's basic core, and multiple
  traits that expand itlity.

  *Snappable* is an trait that indicates that a object can be snapped to.
    Includes: Pipes, Tanks, and Valves

  *Sidded* is an trait that indicates that an object has one or more entrences that
    liquid can be entered through.
      Includes: Pipes, and Tanks

*/
class Snappable extends GameObject {
  constructor(position) {
    super(position)

    this.attachments = {}

    // snap areas are the regions around a given game object
    // that will cause a another object to snap with this object

    // snap parts
    this.snapRadius = 20
  }




  getTopArea() {
    var topArea = new Rect()
    topArea.fill.color = "red"
    topArea.width = this.getWidth()
    topArea.height = this.snapRadius
    topArea.position.x = this.position.x
    topArea.position.y = this.position.y - this.snapRadius

    return topArea
  };

  getBottomArea() {
    var bottomArea = new Rect()
    bottomArea.fill.color = "green"
    bottomArea.width = this.getWidth()
    bottomArea.height = this.snapRadius
    bottomArea.position.x = this.position.x
    bottomArea.position.y = this.position.y + this.getHeight()

    return bottomArea
  };


  getLeftArea() {
    var leftArea = new Rect()
    leftArea.fill.color = "blue"
    leftArea.width = this.snapRadius
    leftArea.height = this.getHeight()
    leftArea.position.x = this.position.x - this.snapRadius
    leftArea.position.y = this.position.y

    return leftArea
  };


  getRightArea() {
    var rightArea = new Rect()
    rightArea.fill.color = "yellow"
    rightArea.width = this.snapRadius
    rightArea.height = this.getHeight()
    rightArea.position.x = this.position.x + this.getWidth()
    rightArea.position.y = this.position.y
    return rightArea
  };

  getSnapAreas() {
    return {
      up: this.getTopArea(),
      down: this.getBottomArea(),
      left: this.getLeftArea(),
      right: this.getRightArea()
    }
  };

  showSnapAreas() {
    var snapAreas = this.getSnapAreas()
    for(var key of Object.keys(snapAreas)) {
      //console.log(key)
      snapAreas[key].fill.opacity = 0.5
      snapAreas[key].createSVG()
    }
  };

  hideSnapAreas() {
    var snapAreas = this.getSnapAreas()
    for(var key of Object.keys(snapAreas)) {
      snapAreas[key].destroySVG()
    }
  };



  /**
    leftSnapBehaviour()
    @description determines what happens when an Snappable snaps to
      the left of another snappable
    @param snappable the Snappable being snapped to
    @param mousePos the current position of the mouse
  */
  leftSnapBehaviour(snappable, mousePos) {
    this.rotation = 90
    var thisRect = this.getRect()
    var otherRect = snappable.getRect()
    // match this object with the left edge of
    // the other object
    this.moveRelativeToCenter({
        x: snappable.getWorldCenter().x - otherRect.width/2 - thisRect.width/2,
        y: mousePos.y
    })
  }

  /**
    rightSnapBehaviour()
    @description determines what happens when an Snappable snaps to
      the right of another snappable
    @param snappable the Snappable being snapped to
    @param mousePos the current position of the mouse
  */
  rightSnapBehaviour(snappable, mousePos) {
    this.rotation = 90
    var thisRect = this.getRect()
    var otherRect = snappable.getRect()


    //thisRect.createSVG()
    //thisRect.updateSVG()

    let point = {
        x: snappable.getWorldCenter().x + otherRect.width/2 + thisRect.width/2,
        y: mousePos.y
    }


    //console.log(thisRect.width);
    // match the right edge
    this.moveRelativeToCenter(point)
  }

  /**
    topSnapBehaviour()
    @description determines what happens when an Snappable snaps to
      the top of another snappable
    @param snappable the Snappable being snapped to
    @param mousePos the current position of the mouse
  */
  topSnapBehaviour(snappable, mousePos) {
    this.rotation = 0
    var thisRect = this.getRect()
    var otherRect = snappable.getRect()

    this.updateSVG()
    this.moveRelativeToCenter({
      y: snappable.getWorldCenter().y - thisRect.height / 2,
      x: mousePos.x
    })
  }



  /**
    bottomSnapBehaviour()
    @description determines what happens when an Snappable snaps to
      the botttom of another snappable
    @param snappable the Snappable being snapped to
    @param mousePos the current position of the mouse
  */
  bottomSnapBehaviour(snappable, mousePos) {
    this.rotation = 90
    var thisRect = this.getRect()
    var otherRect = snappable.getRect()

    this.updateSVG();
    this.moveRelativeToCenter({
      y: snappable.getWorldCenter().y + otherRect.height / 2 + thisRect.height / 2,
      x: mousePos.x
    })
  }

  /**
    findClosestSnapArea()
    @description find the closest snap area to the mouse position
    @param mousePos position of mouse
  */
  findClosestSnapArea(snappable, mousePos) {
    // find the closest snappable region that
    // intersects
    //snappable.showSnapAreas()

    var closestSide = "";
    var closestDistance = 20000;
    var snapAreas = snappable.getSnapAreas()
    //snappable.showSnapAreas();
    var thisRect = this.getRect()
    var otherRect = snappable.getRect()

    for(var side of Object.keys(snapAreas)) {
      var distance = Distance(snapAreas[side].getCenter(), mousePos)
      // find the closest intersecting snap area
      if(distance < closestDistance && thisRect.intersects(snapAreas[side])) {
        closestDistance = distance
        closestSide = side
        console.log(side);
      }
    }

    return closestSide;
  }


  snapTo(snappable, mousePos) {

    let closestSide = this.findClosestSnapArea(snappable, mousePos);
    console.log(closestSide);



    if(closestSide === "left") {
      this.leftSnapBehaviour(snappable, mousePos)
    } else if(closestSide === "right") {
      this.rightSnapBehaviour(snappable, mousePos)
    } else if(closestSide === "up") {
      this.topSnapBehaviour(snappable, mousePos)
    } else if(closestSide === "down") {
      this.bottomSnapBehaviour(snappable, mousePos)
    }

    //console.log(closestSide);
    //console.log(snappable);

    return closestSide;
  };

  /**
    attachTo()
    @description attaches to snappables together on a particular side
    @param side the side to attach to
    @param snappable the snappable to attach this one to

  */
  attachTo(snappable, side) {
  	if(this.attachments[side] === undefined) {
      this.attachments[side] = [snappable]
      console.log(this.attachments);
    } else {
      this.attachments[side].push(snappable)
    }
  };

}
