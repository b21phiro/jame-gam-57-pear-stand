import type System from "../interfaces/System.ts";
import { Scene } from "three";

export default class HarvestSystem implements System {

    constructor() {}

    process(_scene: Scene): void {
        console.log('Processing harvest system!');
    }

}