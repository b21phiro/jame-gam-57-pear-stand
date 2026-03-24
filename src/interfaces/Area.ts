import AreaName from '../enums/Areas.ts';
import {
    Group,
    Vector3,
    Box3,
    Scene, DirectionalLight, HemisphereLight, DirectionalLightHelper, HemisphereLightHelper,
} from 'three';
import Systems from "../enums/Systems.ts";

export default abstract class Area {

    protected _name: string = AreaName.Unknown;
    protected _gridSize: number = 25;
    protected _areaMeshGroup: Group = new Group();
    protected _initialized: boolean = false;
    protected _activeSystem: string = Systems.None;
    protected _enableLightHelpers: boolean = false;

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

    set activeSystem(system: string) {
        this._activeSystem = system;
    }

    get activeSystem(): string {
        return this._activeSystem;
    }

    abstract initialize(scene: Scene): Promise<Group>;

    getCenter() {
        return new Box3()
            .setFromObject(this.meshGroup)
            .getCenter(new Vector3());
    }

    hideLight(scene: Scene): void {
        scene.traverse((object) => {
            if (object.name.includes('Light' + this.name)) object.visible = false;
        })
    }

    showLight(scene: Scene): void {
        scene.traverse((object) => {
            if (object.name.includes('Light' + this.name)) object.visible = true;
        })
    }

    protected _createLight(scene: Scene): void {

        const position = this.getCenter();

        const directionalLight = new DirectionalLight(0xffffff, 2.5);
        directionalLight.position.set(position.x + 25, position.y + 100, position.z + 25);
        directionalLight.target.position.set(position.x, position.y, position.z);
        directionalLight.name = 'Light' + this.name;
        scene.add(directionalLight);

        const hemisphereLight = new HemisphereLight(0xffffff, 0xffffff, 1.0);
        hemisphereLight.position.set(0, 0, 1);
        hemisphereLight.position.set(position.x, position.y, position.z);
        hemisphereLight.name = 'Light' + this.name;
        scene.add(hemisphereLight);

        if (this._enableLightHelpers) {
            const directionalLightHelper = new DirectionalLightHelper(directionalLight, 5);
            scene.add(directionalLightHelper);
            directionalLightHelper.name = 'Light' + this.name;
            const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, 5);
            scene.add(hemisphereLightHelper);
            hemisphereLightHelper.name = 'Light' + this.name;
        }

    }

};