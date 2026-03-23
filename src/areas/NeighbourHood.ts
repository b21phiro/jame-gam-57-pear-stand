import Area from "../interfaces/Area.ts";
import AreaName from "../enums/Areas.ts";
import {
    MeshBasicMaterial,
    BoxGeometry,
    Mesh,
    type Group
} from "three";

export default class NeighbourHood extends Area {

    constructor(name: string = AreaName.Neighbourhood) {
        super(name);
    }

    initialize(): Promise<Group> {
        return new Promise((resolve) => {
            console.log('Initializing neighbourhood');

            const boxMaterial = new MeshBasicMaterial({ color: 0xff0000 });
            const boxGeometry = new BoxGeometry(1, 1, 1);
            const box = new Mesh(boxGeometry, boxMaterial);
            this.meshGroup.add(box);

            this._initialized = true;

            resolve(this.meshGroup);

        });
    }

}