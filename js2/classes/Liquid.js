class Liquid {
  constructor(value, color) {
    this.value = value;
    this.color = color; // { red: 0, green: 0, blue: 0 } <-- This is what the object
                        //                                   should look like.
  }

  fill() {
    return "rgb(" + this.color.red + "," + this.color.green + "," + this.color.blue + ")";
  }

  /*
    Average the two liquids together.
  */
  static mix(liquid1, liquid2) {
    return new Liquid (
      Math.floor((liquid1.value + liquid2.value) / 2),
      {
        red: Math.floor((liquid1.color.red + liquid2.color.red) / 2),
        green: Math.floor((liquid1.color.green + liquid2.color.green) / 2),
        blue: Math.floor((liquid1.color.blue + liquid2.color.blue) / 2)
      }
    )
  }

}
