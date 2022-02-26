/**
 * FluidRegistry - a database that keep track of all the fluids and their names
 */

import { getRandomInt } from "../../util";

export default class FluidRegistry {

    static fluids = {};

    /**
     * register()
     * @description adds a fluid to the registry
     * @param {Fluid} fluid the fluid to add to the registry
     */
    static register(fluid) {
        FluidRegistry.fluids[fluid.name] = fluid;
    }


    /**
     * lookup()
     * @description looks up the fluid with the name name in the registry
     * @param {String} name the name of the fluid
     * @returns a fluid with the name name
     */
    static lookup(name) {
        return FluidRegistry.fluids[name]
    }


    /**
     * getRandom()
     * @description gets a random fluid from the registry
     */
    static getRandom() {
        let fluidCount = Object.keys(FluidRegistry.fluids).length
        let randomName = Object.keys(FluidRegistry.fluids)[getRandomInt(0, fluidCount)]
        return FluidRegistry.fluids[randomName];
    }
}