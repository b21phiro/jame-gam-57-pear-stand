import Area from "../interfaces/Area.ts";
import AreaName from "../enums/Areas.ts";
import { Scene, PerspectiveCamera } from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Systems from "../enums/Systems.ts";

export default class AreaManager {

    private _areas: Area[];
    private _currentAreaName: string;
    private _areaChangeListeners: Function[];

    constructor(areas: Area[] = []) {
        this._areas = areas;
        this._currentAreaName = AreaName.Unknown;
        this._areaChangeListeners = [];
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

    setCurrentSystem(system: string) {
        if (!this.currentArea) throw new Error('No current area set');
        this.currentArea.activeSystem = system;
    }

    onAreaChange(callback: Function) {
        this._areaChangeListeners.push(callback);
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
        this._makeAreaInvisible(scene, previousArea);
        this._makeAreaVisible(scene, areaName);
        this._moveCameraTo(area, camera, orbitControls);
        this.setCurrentSystem(Systems.None);
        this._notifyAreaChangeListeners();
    }

    update(scene: Scene): void {
        this.currentArea!.update(scene);
    }

    private _makeAreaInvisible(scene: Scene, areaName: string) {
        const areaGroup = scene.getObjectByName(areaName);
        if (!areaGroup) throw new Error('Area group not found');
        areaGroup.visible = false;
    }

    private _makeAreaVisible(scene: Scene, areaName: string) {
        const areaGroup = scene.getObjectByName(areaName);
        if (!areaGroup) throw new Error('Area group not found');
        areaGroup.visible = true;
    }

    private _moveCameraTo(area: Area, camera: PerspectiveCamera, orbitControls: OrbitControls) {
        const center = area.getCenter();
        camera.position.set(
            center.x + 10.0,
            center.y + 10.0,
            center.z - 10.0
        );
        orbitControls.target.copy(center);
        orbitControls.update();
    }

    private _notifyAreaChangeListeners() {
        this._areaChangeListeners.forEach(listener => listener());
    }

}