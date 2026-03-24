import { Scene } from "three";

export default interface System {

    process(scene: Scene): void;

}