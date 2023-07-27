import Inventory from "./gui/Inventory";
import Slot from "./gui/Slot";
import ValueBox from "./gui/ValueBox";

/**
 * HUD - the gui 
 */
export class HUD {
    /**
     * constructor()
     * @description constructs the HUD
     * @param {Player} player the player currently playing the game
     */
    constructor(game, player) {
        this._player = player;
        this._game = game;

        this._inventory = new Inventory(game.layers[0], player, {x: 20, y: 20}, 275, game.height - 30);

        /*this._credits = new ValueBox({x: 20, y: 20}, 250, 25);
        this._credits.create(svg)
        this._credits.update()

        this._credits.styling = {
            color: "red",
            textColor: "black",
            strokeColor: "black",
            strokeWidth: 10
        }

        this._credits.label = "Coins";
        this._credits.value = 0;*/
    }


    /**
     * create()
     * @description creates the hud 
     */
    create() {
        this._inventory.create();
    }

    /**
     * get inventory()
     * @description gets the inventory of the hud
     * @returns the inventory of the HUD
     */
    get inventory() {
        return this._inventory;
    }

    /**
     * get credits()
     * @description gets the credits of the hud
     * @returns the credits of the HUD
     */
    get credits() {
        return this._credits;
    }

}