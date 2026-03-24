import {
    Scene,
    PerspectiveCamera,
    Raycaster, type Vector2
} from "three";

export default class TileSelectionSystem {

    private _raycaster: Raycaster;

    constructor() {
        this._raycaster = new Raycaster();
    }

    process(mouse: Vector2, camera: PerspectiveCamera, scene: Scene): void {
        this._raycaster.setFromCamera(mouse, camera);
        const intersects = this._raycaster.intersectObjects(scene.children);
        if (intersects.length === 0) return;
        console.log(intersects);
    }

}