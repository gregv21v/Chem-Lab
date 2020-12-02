class HomeScreen extends Screen {
  constructor() {
    super()

    let svg = d3.select("body").select("svg")
    svg
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)
    let height = svg.attr("height");
    let width = svg.attr("width");

    this.creativeBtn = new Button(
      {
        x: width / 2, y: height / 2
      },
      150,
      50
    )
    this.creativeBtn.setText("Creative Mode")
    this.creativeBtn.setFill({color: "blue"})

    this.normalBtn = new Button(
      {
        x: width / 2, y: height / 2 + 60
      },
      150,
      50
    )
    this.normalBtn.setText("Normal Mode")
    this.normalBtn.setFill({color: "blue"})
  }

  /**
    createSVG()
    @description adds the svg to the screen
  */
  createSVG() {
    this.creativeBtn.createSVG();
    this.normalBtn.createSVG();
  }


  /**
    updateSVG()
    @description updates the properties of the svg
  */
  updateSVG() {
    this.creativeBtn.updateSVG()
    this.normalBtn.updateSVG();
  }
}
