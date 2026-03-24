import {
    Scene,
    PerspectiveCamera,
    Raycaster,
    type Vector2,
    type Intersection,
    type Object3D
} from "three";

export default class IntersectionSystem {

    private _raycaster: Raycaster;

    private _intersects: Intersection<Object3D>[];

    constructor() {
        this._raycaster = new Raycaster();
        this._intersects = [];
    }

    process(mouse: Vector2, camera: PerspectiveCamera, scene: Scene): void {
        this._raycaster.setFromCamera(mouse, camera);
        this._intersects = this._raycaster.intersectObjects(scene.children).filter(intersect =>
            intersect.object.name !== ''
        );
    }

    get intersects(): Intersection<Object3D>[] {
        return this._intersects;
    }

}