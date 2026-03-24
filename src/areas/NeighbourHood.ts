import Area from "../interfaces/Area.ts";
import AreaName from "../enums/Areas.ts";
import {
    BoxGeometry,
    Mesh,
    type Group,
    type Scene,
    MeshStandardMaterial
} from "three";

export default class NeighbourHood extends Area {

    constructor(name: string = AreaName.Neighbourhood) {
        super(name);
    }

    initialize(scene: Scene): Promise<Group> {
        return new Promise((resolve) => {
            console.log('Initializing neighbourhood');

            const boxMaterial = new MeshStandardMaterial({ color: 0xff0000 });
            const boxGeometry = new BoxGeometry(1, 1, 1);
            const box = new Mesh(boxGeometry, boxMaterial);
            this.meshGroup.add(box);

            this._initialized = true;

            this._createLight(scene);

            resolve(this.meshGroup);

        });
    }

    update(_scene: Scene): void {}

}