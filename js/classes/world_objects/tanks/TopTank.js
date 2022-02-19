/**
 * TopTank - a tank with the top opened.
 */
class TopTank extends Tank {

	/**
	 * constructor()
	 * @description constructs the TopTank
	 * @param {Point} center the center of where the tank is located 
	 * @param {Object (width, height)} interior the interior width and height of the tank
	 * @param {Number} wallWidth the width of the walls of the tank
	 */
	constructor(center, interior, wallWidth) {
		super(center, interior, wallWidth)
	}


	/**
	 * getName()
	 * @description gets the name of the tank
	 */
	getName() {
		return "Top Tank"
	}
}
