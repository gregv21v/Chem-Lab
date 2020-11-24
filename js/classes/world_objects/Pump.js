/*
	Pump: every time you click the pump, a drop of liquid is
	produced. Liquid always comes from the bottom of the pump.

	Alternatively, if an engine is attached to the pump, it will pump
	fluid out automatically.




	extra:
		make it so button bubbles in and out when clicked

*/
class Pump extends GameObject {
	constructor(world, position, production) {
		super(position)

		this.production = production;
		this.position = position;
		this.world = world
	}

	createSVG() {
		var mainSVG = d3.select("body").select("svg")
		this.group = mainSVG.append("g")
		this.svg = {
			spout: this.group.append("rect"), // where the liquid comes out
			button: this.group.append("circle") // pressed to get liquid
		}

		var self = this;
		this.svg.button.on("mousedown", function() {
			self.produceDrop()
		})

		this.updateSVG()
	};

	updateSVG() {
		var self = this;

		this.svg.button
			.attr("r", this.production * 2)
			.attr("cx", this.position.x)
			.attr("cy", this.position.y)
			.style("fill", "red")

		this.svg.spout
			.attr("width", this.production)
			.attr("height", this.production * 2)
			.attr("x", this.position.x - this.production/2)
			.attr("y", this.position.y + this.production)
	}


	/*
		Creates a drop of liquid upon clicking the pump.
	*/
	produceDrop() {
		// liquids that this pump could produce
		var possibleLiquids = [
			new Liquid(1, {red: 50, green: 0, blue: 100}),
			new Liquid(3, {red: 0, green: 75, blue: 100}),
			new Liquid(5, {red: 10, green: 100, blue: 100}),
			new Liquid(100, {red: 255, green: 0, blue: 0})
		];

		var drop = new Drop(
				{x: this.position.x - this.production/2, y: this.position.y + this.production * 3},
				this.production,
				possibleLiquids[getRandomInt(0, possibleLiquids.length)]
		  )
		drop.createSVG();
		this.world.addDrop(drop);
	};

	getWidth() {
		return this.production * 4;
	}


	getHeight() {
		return this.production * 4;
	};

	/*
		A info used for creating a tooltip
	*/
	getName() {
		return this.production;
	};

	getLiquidType() {
		return "Water";
	};

}
