import type System from "../interfaces/System.ts";
import { Scene } from "three";

export default class SowSystem implements System {

    constructor() {}

    process(_scene: Scene): void {
        console.log('Processing sow system!');
    }

}