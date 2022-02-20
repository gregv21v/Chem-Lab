/*
	Pump: every time you click the pump, a drop of liquid is
	produced. Liquid always comes from the bottom of the pump.

	Alternatively, if an engine is attached to the pump, it will pump
	fluid out automatically.




	extra:
		make it so button bubbles in and out when clicked

*/
import GameObject from "./GameObject";
import Drop from "./Drop"
import ToolTip from "../gui/ToolTip";
import Liquid from "../Liquid";
import { getRandomInt } from "../util";

import * as d3 from "d3"

export default class Pump extends GameObject {
	/**
	 * 
	 * @param {World} world the world that the pump is in
	 * @param {Point} position the position of the pump
	 * @param {*} production 
	 */
	constructor(world, position, production) {
		super(position)

		this.production = production;
		this.position = position;

		let mainSVG = d3.select("body").select("svg")
		this.svg = {
			spout: mainSVG.append("rect"), // where the liquid comes out
			button: mainSVG.append("circle") // pressed to get liquid
		}

		this.tooltip = new ToolTip(
	    this.position,
	    "Click to produce liquid");


		var self = this;
		this.svg.button.on("mousedown", function() {
			self.produceDrop(world)
		})
	}

	createSVG() {
		this.updateSVG();
	};

	updateSVG() {
		var self = this;
		//this.tooltip.createSVG();

		this.svg.button.attr("r", this.production * 2);
		this.svg.button.attr("cx", this.position.x);
		this.svg.button.attr("cy", this.position.y);
		this.svg.button.style("fill", "red")
			.on("mouseenter", function() {
				self.tooltip.show();
			})
			.on("mouseout", function() {
				self.tooltip.hide();
			});

		this.svg.spout.attr("width", this.production);
		this.svg.spout.attr("height", this.production * 2);
		this.svg.spout.attr("x", this.position.x - this.production/2);
		this.svg.spout.attr("y", this.position.y + this.production);
	}


	/*
		Creates a drop of liquid upon clicking the pump.
	*/
	produceDrop(world) {
		var possibleLiquids = [
			new Liquid(1, {red: 50, green: 0, blue: 100}),
			new Liquid(3, {red: 0, green: 75, blue: 100}),
			new Liquid(5, {red: 10, green: 100, blue: 100}),
			new Liquid(6, {red: 255, green: 0, blue: 0})
		];



		var drop = new Drop(
				{x: this.position.x - this.production/2, y: this.position.y + this.production * 3},
				this.production,
				possibleLiquids[getRandomInt(0, possibleLiquids.length)]
		  )
		drop.createSVG();
		world.addDrop(drop);
	};

	updateTooltip() {
	  this.tooltip.position = this.position;
	}

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
