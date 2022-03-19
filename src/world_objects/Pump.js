/*
	Pump: every time you click the pump, a drop of liquid is
	produced. Liquid always comes from the bottom of the pump.

	Alternatively, if an engine is attached to the pump, it will pump
	fluid out automatically.




	extra:
		make it so button bubbles in and out when clicked

*/
import GameObject from "./GameObject";
import Drop from "./fluids/Drop";
import ToolTip from "../gui/ToolTip";
import { getRandomInt } from "../util";

import * as d3 from "d3"
import Fluid from "./fluids/Fluid";
import FluidRegistry from "./fluids/FluidRegistry";

export default class Pump extends GameObject {
	/**
	 * 
	 * @param {World} world the world that the pump is in
	 * @param {Point} position the position of the pump
	 * @param {Number} production 
	 */
	constructor(world, position, production) {
		super(position, {x: 0, y: 0})

		this.production = production;
		this._position = position;
		this._world = world;

		this.tooltip = new ToolTip(
			this._position,
			"Click to produce liquid");
	}

	createSVG(parent) {
		this._group = d3.create("svg:g")
		this._svg = {
			spout: this._group.append("rect"), // where the liquid comes out
			button: this._group.append("circle") // pressed to get liquid
		}

		var self = this;
		this._svg.button.on("mousedown", function() {
			self.produceDrop(self._world)
		})

		parent.append(() => this._group.node())
		this.updateSVG();
	};

	updateSVG() {
		var self = this;
		//this.tooltip.createSVG();

		this._svg.button.attr("r", this.production * 2);
		this._svg.button.attr("cx", this._position.x);
		this._svg.button.attr("cy", this._position.y);
		this._svg.button.style("fill", "red")
			.on("mouseenter", function() {
				self.tooltip.show();
			})
			.on("mouseout", function() {
				self.tooltip.hide();
			});

		this._svg.spout.attr("width", this.production);
		this._svg.spout.attr("height", this.production * 2);
		this._svg.spout.attr("x", this._position.x - this.production/2);
		this._svg.spout.attr("y", this._position.y + this.production);
	}


	/**
	 * produceDrop()
	 * @description Creates a drop of liquid upon clicking the pump.
	 * @param {World} world the world to produce the drop in
	 */
	produceDrop(world) {
		let fluid = FluidRegistry.getRandom();
		let size = getRandomInt(5, 15)

		let drop = new Drop(
			{x: this._position.x - this.production/2, y: this._position.y + this.production * 3}, // position
			{x: 0, y: 1}, // velocity
			size,
			fluid
		)
		
		drop.create(d3.select("svg"));
		world.addDrop(drop);
	}

	updateTooltip() {
	  this.tooltip.position = this._position;
	}

	/**
	 * get width()
	 * @returns the width of the pump
	 */
	get width() {
		return this.production * 4;
	}


	/**
	 * get height()
	 * @returns the height of the Pump
	 */
	get height() {
		return this.production * 4;
	}

	/**
	 * get name()
	 * @description A info used for creating a tooltip
	*/
	get name() {
		return this.production;
	}

	/**
	 * get liquidType()
	 * @description gets the liquid type
	 */
	get liquidType() {
		return "Water";
	}

}
