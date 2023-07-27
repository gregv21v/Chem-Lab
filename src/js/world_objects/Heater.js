import Fire from "../shapes/Fire";
import Rect from "../shapes/Rect";
import SnapPoint from "./SnapPoint";
import Snappable from "./Snappable";
import * as d3 from "d3";
import Tank from "./tanks/Tank";
import Group from "../shapes/Group";

/**
 * Heater - heats the the fluid in a tank
 * 
 * Heating a fluid can change its density and maybe cause it to evaporate 
 */
export default class Heater extends Snappable {
    /**
     * constructor()
     * @description constructs the heater
     * @param
     */
    constructor(layer, position, width, height) {
        super(layer, position, width, height);

        this._isOn = true;
        this._tempature = 5;
        this._description = [
            "Heaters heat the fluids in",
            "tanks causing the liquids",
            "to expand"
        ]
        ;
    }


    /**
	 * createSnapPoint() 
	 * @description creates the snap points of the tank
	 */ 
	createSnapPoints() {
		this._snapWidth = 20;
		this._snapPoints = [

			// top
			new SnapPoint(
				{
					x: 0,
					y: this._boundingBox.position.y
				},
				this.width,
				this._snapWidth,
				{x: this._boundingBox.position.x + this._boundingBox.width, y: this._boundingBox.position.y},
				"y",
				"up"
			)
		]

		for (const point of this._snapPoints) {
			point.fill.color = "orange"
			point.fill.opacity = 0.0;
			point.stroke.opacity = 0;
			point.create();
			this._snapGroup.add(point);
		}

	}



    create() {
		this._group = this._layer.append("g")

        this._boundingBox.position = this._position;
        this._boundingBox.width = this._width;
        this._boundingBox.height = this._height + 10
		this._boundingBox.fill.opacity = 0.0
        this._boundingBox.fill.color = "blue"
		this._boundingBox.stroke.opacity = 0;

		this._boundingBox.create();
		


		this._graphicsGroup = this.createGraphics(this._group);
        //this._objectGroup.add(this._boundingBox);
		this.createSnapPoints();

        this.update();
	}


    /**
     * createGraphics()
     * @description creates the graphics for the heater 
     * @param {SVGElement} svgGroup the group to create the graphics for
     */
    createGraphics(svgGroup) {

        let hotPlateHeight = 10;
        let offset = 10;
        let delta = 0// the difference in height between the orange and red flames

        let redMax = 20
        let group = new Group(svgGroup);
        let redFire = new Fire(
            svgGroup,
            {x: this._boundingBox.x, y: this._boundingBox.y + this._boundingBox.height - hotPlateHeight - redMax - offset - 5},
            this._width,
            redMax, // max
            8, // min
            offset + 5, // offset
            20 // flameCount
        )

        redFire.fill.color = "red"
        redFire.fill.opacity = (this._isOn ? 1 : 0)
        redFire.create();
        group.add(redFire);



        let orangeMax = 10
        let orangeFire = new Fire(
            svgGroup,
            {x: this._position.x + 30 / this._width, y: this._boundingBox.y + this._boundingBox.height - hotPlateHeight - orangeMax - offset},
            this._width - 60 / this._width,
            orangeMax, // max
            5, // min
            offset, // offset
            16 // flameCount
        )

        orangeFire.fill.color = "orange"
        orangeFire.fill.opacity = (this._isOn ? 1 : 0)
        orangeFire.create();
        group.add(orangeFire);


        let hotPlate = new Rect(
            svgGroup,
            {x: this._boundingBox.x, y: this._boundingBox.y + this._boundingBox.height - hotPlateHeight},
            this._boundingBox.width,
            hotPlateHeight
        )

        hotPlate.fill.color = "black"
        hotPlate.fill.opacity = 1;
        hotPlate.create();
        group.add(hotPlate)

        return group;
    }


    /**
	 * snapAdjustments() 
	 * @description these are adjustments made to the relative position of two snapping objects 
	 * @param {Pair} pair the pair of objects being snapped 
	 * @param {Rect} movingObject the object being moved
	 */
	snapAdjustments(pair) {
		if(pair.fixed.side === "left" && pair.fixed.point.x < this.center.x) {
			this.moveBy({
				x: -this.boundingBox.width,
				y: 0
			})
		} 

		if(pair.fixed.side === "right" && pair.fixed.point.x > this.center.x) {
			this.moveBy({
				x: +this.boundingBox.width,
				y: 0
			})
		} 
		

		if(pair.fixed.side === "up" && pair.fixed.point.y < this.center.y) {
			this.moveBy({
				x: 0,
				y: -this.boundingBox.height
			})
		} 

		if(pair.fixed.side === "down" && pair.fixed.point.y > this.center.y) {
			this.moveBy({
				x: 0,
				y: this.boundingBox.height
			})
		} 
	}

    /**
     * moveTo()
     * @description moves to a given point, where the center of the Snappable is
     *  fixed at the given point
     * @param point the point to center on
     */
    moveTo(point) {
        super.moveTo(point);
    }


    /**
     * heat()
     * @description uses the heater to heat something
     * @param {World} world The world that the heater is in
     */
    heat(world) {
        let top = this._snapPoints[0].attachments[0];

        if(top instanceof Tank) {
            top.heatLiquids(world);
        }
    }


    /**
	 * get name()
	 * @returns gets the name of the pipe
	 */
	get name() {
		return "Heater"
	}

    /**
     * get height()
     * @description the width of the shape of the object irregardless of
     * of what type of object it is
     */
    get width() {
        return this._width;
    };

    /**
     * get height()
     * @description the height of the shape of the object irregardless of
     *  of what type of object it is
     */
    get height() {
        return this._height;
    };



    /**
     * get description()
     * @description the description of what the object does
     *
     */
    get description() {
        return this._description;
    }
}


