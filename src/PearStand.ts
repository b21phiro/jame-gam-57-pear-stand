import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from 'three';
import NeighbourHood from "./areas/NeighbourHood.ts";
import AreaManager from "./managers/AreaManager.ts";
import Garden from "./areas/Garden.ts";
import Areas from "./enums/Areas.ts";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import UiManager from "./managers/UiManager.ts";
import Toggle from "./ui/Toggle.ts";
import UiElementPosition from "./enums/UiElementPositions.ts";

export default class PearStand {

    private _rootElement: HTMLElement;
    private _engine: WebGLRenderer;
    private _scene: Scene;
    private _camera: PerspectiveCamera;
    private _orbitControls: OrbitControls;
    private _uiManager: UiManager;

    private _areaManager: AreaManager;

    constructor(rootElement: HTMLElement) {

        this._rootElement = rootElement;

        this._engine = new WebGLRenderer({
            antialias: true,
            alpha: true
        });

        this._scene = new Scene();

        this._camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._orbitControls = new OrbitControls(this._camera, this._engine.domElement);

        const areas = [
            new Garden(),
            new NeighbourHood(),
        ];
        this._areaManager = new AreaManager(areas);

        this._uiManager = new UiManager();

        window.addEventListener('resize', this._resizeHandler.bind(this));

    }

    public init(): void {

        const container = document.createElement('DIV');
        container.classList.add('container');
        container.appendChild(this._engine.domElement);

        this._engine.domElement.classList.add('canvas');
        this._rootElement.appendChild(container);
        this._rootElement.appendChild(this._uiManager.domElement);

        this._areaManager.currentArea = Areas.Garden;
        this._resizeHandler();

        this._camera.position.z = -5.0;
        this._orbitControls.update();

        const sceneToggle = new Toggle();
        sceneToggle.defaultOn = this._areaManager.isCurrent(Areas.Garden);
        sceneToggle.onToggle = () => this._toggleScene();
        this._uiManager.addUiElement(UiElementPosition.TopRight, sceneToggle);

    }

    public start(): void {
        const areaName = this._areaManager.currentAreaName;
        this._areaManager.showArea(areaName, this._scene, this._camera, this._orbitControls).catch(error => console.error(error));
        this._engine.setAnimationLoop(this._loop.bind(this));
    }

    private _loop(): void {
        this._orbitControls.update();
        this._draw();
    }

    private _draw(): void {
        this._engine.render(this._scene, this._camera);
    }

    private _resizeHandler(): void {
        const canvasStyle = getComputedStyle(this._engine.domElement);
        const width = parseInt(canvasStyle.getPropertyValue('width'));
        const height = Math.max(parseInt(canvasStyle.getPropertyValue('height')), 1);
        this._engine.setSize(width, height, false);
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        this._orbitControls.update();
    }

    private _toggleScene(): void {
        const isNeighbourhood = this._areaManager.isCurrent(Areas.Neighbourhood);
        const changeAreaTo = isNeighbourhood ? Areas.Garden : Areas.Neighbourhood;
        this._areaManager.showArea(changeAreaTo, this._scene, this._camera, this._orbitControls).catch(error => console.error(error));
    }

}