class SideTab {
    /**
      constructor()
      @description constructs the item
      @param position the top left corner of the tab button
      @param buttonDims the dimensions of the tab button
      @param contentDims the dimensions of the area that contains the
        contents of the tab
      @param windowDims the dimensions of the window that the tab will
        be on
      @param name the name of the tab
    */
    constructor(position, buttonDims, contentDims, windowDims, name) {

      this.name = name;
      this.buttonDims = buttonDims;
      this.contentDims = contentDims;
      this.windowDims = windowDims;
      this.position = position;
      this.isClosed = true;

      this.svg = {
        group: d3.create("svg:g")
      }
      this.svg.buttonBackground = this.svg.group.append("rect")
      this.svg.label = this.svg.group.append("text")
      this.svg.contentArea = this.svg.group.append("rect")
      this.svg.contentAreaGroup = this.svg.group.append("g")
      this.createGraphic(this.svg.group);
      this.svg.buttonClickArea = this.svg.group.append("rect")

      this.styles = {
        fill: "grey",
        textColor: "black"
      }
    }

    /**
      addGraphicsTo()
      @description add the graphics of the side tab to a given svg group
      @param group the group to add the graphics to
    */
    addGraphicsTo(group) {
      group.append(() => this.svg.group.node())
    }

    /**
      createGraphic()
      @description override this function to draw the graphics for the
        block.
        Each svg should be added to this.sv
      @param group the svg group to create the graphics on
    */
    createGraphic(group) {
      // make your graphics here add add them to the this.svg object
    }

    /**
      getGraphic()
      @description gets the graphical presentation of this side tab
    */
    getGraphic() {
      return this.svg.group;
    }

    /**
      open()
      @description opens the tab
    */
    open() {
      var textPos = {
        x: this.position.x + this.buttonDims.width/2 - 5 - this.contentDims.width,
        y: this.position.y + this.buttonDims.height/2 - (this.name.length*6)/2
      }

      // render the background
      this.svg.buttonBackground
        .attr("x", this.position.x - this.contentDims.width)

      this.svg.label
        .attr(
          "transform",
          "translate(" + textPos.x + "," + textPos.y + ")rotate(90)")

      this.svg.contentArea
        .attr("x", this.position.x + this.buttonDims.width - this.contentDims.width)

      this.svg.buttonClickArea
        .attr("x", this.position.x - this.contentDims.width)
    }

    /**
      close()
      @description closes the tab
    */
    close() {
      var textPos = {
        x: this.position.x + this.buttonDims.width/2 - 5,
        y: this.position.y + this.buttonDims.height/2 - (this.name.length*6)/2
      }

      // render the background
      this.svg.buttonBackground
        .attr("x", this.position.x)

      this.svg.label
        .attr(
          "transform",
          "translate(" + textPos.x + "," + textPos.y + ")rotate(90)")

      this.svg.contentArea
        .attr("x", this.position.x + this.buttonDims.width)

      this.svg.buttonClickArea
        .attr("x", this.position.x)
    }


    /**
      initSVG()
      @description initializes the svgs for this side tab
    */
    initSVG() {
      // initialzies svg
      this.svg.buttonBackground
        .attr("x", this.position.x)
        .attr("y", this.position.y)
        .attr("width", this.buttonDims.width)
        .attr("height", this.buttonDims.height)
        .style("fill", this.styles.fill)
        .style("stroke", "black")

      var self = this;
      // render the background


      var textPos = {
        x: this.position.x + this.buttonDims.width/2 - 5,
        y: this.position.y + this.buttonDims.height/2 - (this.name.length*6)/2
      }

      this.svg.label
        .style("stroke", this.styles.textColor)
        .attr(
          "transform",
          "translate(" + textPos.x + "," + textPos.y + ") rotate(90)")
        .text(this.name)

      this.svg.contentArea
        .attr("x", this.position.x + this.buttonDims.width)
        .attr("y", 0)
        .attr("width", this.contentDims.width)
        .attr("height", this.contentDims.height)
        .style("fill", this.styles.fill)

      this.svg.buttonClickArea
        .attr("x", this.position.x)
        .attr("y", this.position.y)
        .attr("width", this.buttonDims.width)
        .attr("height", this.buttonDims.height)
        .style("fill-opacity", 0)
        .on("click", function() {self.onClick()});
    }

    /**
      unrender()
      @description removes the block from the canvas
    */
    remove() {
      for (var svg of Object.keys(this.svg)) {
        this.svg[svg].remove();
      }
    }

    /**
      onClick()
      @description the function called when this block is clicked
    */
    onClick() {
      if(this.isClosed) {
        this.open();
        this.isClosed = false;
      } else {
        this.close();
        this.isClosed = true
      }
    }



  }