import {type Intersection, Object3D, Scene} from "three";

export default class DiggingSystem {

    constructor() {}

    process(_scene: Scene, _intersects: Intersection<Object3D>[], _didClick: boolean): void {
        if (_intersects.length === 0 || !_didClick) return;
        const { object } = _intersects[0];
        if (object.name === 'Top') {
            if (object.userData?.isDiggable && object.userData?.dug === false) {
                object.visible = false;
                object.userData.dug = true;
            }
        }
    }

}