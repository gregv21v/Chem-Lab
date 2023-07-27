/**
 * SideTabManager - manages the location of the side tabs
 */

export default class SideTabManager {

    /**
     * constructor()
     * @description constructs the tab manager
     */
    constructor(windowWidth, windowHeight) {
        this._windowWidth = windowWidth;
        this._windowHeight = windowHeight;

        this._tabs = {
            left: [],
            right: []
        };
    }


    /**
     * addTab()
     * @description add a tab to the side of the screen
     * @param {SideTab} sideTab the tab to add 
     * @param {string} side the side to add the tab to
     */
    addTab(tab, side) {
        if(this._tabs[side].length > 0) {
            let nextY = this._tabs[side][this._tabs[side].length-1].bottomY
            tab.moveToSide(side, nextY, this._windowWidth)
        } else {
            tab.moveToSide(side, 0, this._windowWidth)
        }
            
        this._tabs[side].push(tab);
    }


    /**
     * create()
     * @description creates the tab manager
     */
    create() {
        for (const tab of this._tabs) {
            tab.create()
        }
    }
}