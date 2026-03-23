import Area from "../interfaces/Area.ts";
import AreaName from "../enums/Areas.ts";
import { Scene, PerspectiveCamera, type Group } from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class AreaManager {

    private _areas: Area[];
    private _currentAreaName: string;

    constructor(areas: Area[] = []) {
        this._areas = areas;
        this._currentAreaName = AreaName.Unknown;
    }

    set currentArea(theArea: string) {
        this._currentAreaName = theArea;
    }

    get currentArea(): Area | undefined {
        return this._areas.find(area => area.name === this._currentAreaName);
    }

    get currentAreaName(): string {
        return this._currentAreaName;
    }

    isCurrent(areaName: string): boolean {
        return this._currentAreaName === areaName;
    }

    async showArea(areaName: string, scene: Scene, camera: PerspectiveCamera, orbitControls: OrbitControls) {
        const previousArea = this.currentAreaName;
        this.currentArea = areaName;
        const area = this.currentArea;
        if (!area) throw new Error('Area not found');
        if (!area.initialized) {
            await area.initialize().catch(error => console.error(error));
            scene.add(area.meshGroup);
        }
        const areaGroup = scene.getObjectByName(area.name) as Group | undefined;
        if (!areaGroup) throw new Error('Area group not found');
        this._hideArea(scene, previousArea);
        areaGroup.visible = true;
        camera.position.set(
            areaGroup.position.x + 5.0,
            areaGroup.position.y + 5.0,
            areaGroup.position.z - 5.0
        );
        orbitControls.target.copy(areaGroup.position);
        orbitControls.update();
    }

    private _hideArea(scene: Scene, areaName: string) {
        const areaGroup = scene.getObjectByName(areaName);
        if (!areaGroup) throw new Error('Area group not found');
        areaGroup.visible = false;
    }

}