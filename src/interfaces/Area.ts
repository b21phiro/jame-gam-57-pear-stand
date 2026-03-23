import AreaName from '../enums/Areas.ts';
import {
    Group,
    Vector3,
    Box3
} from 'three';

export default abstract class Area {

    protected _name: string = AreaName.Unknown;
    protected _gridSize: number = 25;
    protected _areaMeshGroup: Group = new Group();
    protected _initialized: boolean = false;

    protected constructor(name: string) {
        this._name = name;
        this._areaMeshGroup.name = name;
    }

    get meshGroup(): Group {
        return this._areaMeshGroup;
    }

    get name(): string {
        return this._name;
    }

    get initialized(): boolean {
        return this._initialized;
    }

    abstract initialize(): Promise<Group>;

    getCenter() {
        return new Box3()
            .setFromObject(this.meshGroup)
            .getCenter(new Vector3());
    }

};