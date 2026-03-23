import Area from "../interfaces/Area.ts";
import AreaName from "../enums/Areas.ts";
import {
    BoxGeometry,
    type Group,
    Mesh,
    MeshBasicMaterial
} from "three";

export default class Garden extends Area {

    constructor(name: string = AreaName.Garden) {
        super(name);
    }


    initialize(): Promise<Group> {
        return new Promise((resolve) => {
            console.log('Initializing ', this.name);

            const boxMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
            const boxGeometry = new BoxGeometry(1, 1, 1);
            const box = new Mesh(boxGeometry, boxMaterial);
            this.meshGroup.add(box);

            this.meshGroup.position.set(50, 0, 50);

            this._initialized = true;

            resolve(this.meshGroup);

        });
    }

}