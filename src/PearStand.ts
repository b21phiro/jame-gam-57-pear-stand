import {
    PerspectiveCamera,
    Scene, Vector2,
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
import Toolbox from "./ui/Toolbox.ts";
import StateManager from "./managers/StateManager.ts";
import States from "./enums/States.ts";

import ShovelPNG from "./assets/images/shovel.png";
import SeedPNG from "./assets/images/seed.png";
import HarvestPNG from "./assets/images/harvest.png";
import Systems from "./enums/Systems.ts";

export default class PearStand {

    private _rootElement: HTMLElement;
    private _engine: WebGLRenderer;
    private _scene: Scene;
    private _camera: PerspectiveCamera;
    private _orbitControls: OrbitControls;
    private _uiManager: UiManager;
    private _stateManager: StateManager;

    private _areaManager: AreaManager;
    private _mouse: Vector2;

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

        this._stateManager = new StateManager();

        this._mouse = new Vector2();

        window.addEventListener('resize', this._resizeHandler.bind(this));
        window.addEventListener('mousemove', this._mouseMoveHandler.bind(this));
        window.addEventListener('mouseout', this._mouseOutHandler.bind(this));
        window.addEventListener('mouseleave', this._mouseLeaveHandler.bind(this));

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

        const gardenToolbox = new Toolbox();
        gardenToolbox.name = "GardenToolbox";
        gardenToolbox.onlyVisible = Areas.Garden;
        this._uiManager.addUiElement(UiElementPosition.BottomCenter, gardenToolbox);

        gardenToolbox.addTool(States.Digging, () => {
            this._stateManager.currentState = States.Digging;
            gardenToolbox.handleStateChange(this._stateManager.currentState);
            this._areaManager.setCurrentSystem(Systems.Digging);
        }, ShovelPNG);

        gardenToolbox.addTool(States.Planting, () => {
            this._stateManager.currentState = States.Planting;
            gardenToolbox.handleStateChange(this._stateManager.currentState);
            this._areaManager.setCurrentSystem(Systems.Sowing);
        }, SeedPNG);

        gardenToolbox.addTool(States.Harvesting, () => {
            this._stateManager.currentState = States.Harvesting;
            gardenToolbox.handleStateChange(this._stateManager.currentState);
            this._areaManager.setCurrentSystem(Systems.Harvesting);
        }, HarvestPNG);


        this._uiManager.onAreaChange(this._areaManager.currentAreaName);
        this._areaManager.onAreaChange(gardenToolbox.handleAreaChange.bind(gardenToolbox));

    }

    public start(): void {
        const areaName = this._areaManager.currentAreaName;
        this._areaManager.showArea(areaName, this._scene, this._camera, this._orbitControls).catch(error => console.error(error));
        this._mouse.set(-1000000, -1000000);
        this._engine.setAnimationLoop(this._loop.bind(this));
    }

    private _loop(): void {
        this._areaManager.update(this._mouse, this._scene, this._camera);
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
        this._uiManager.onAreaChange(this._areaManager.currentAreaName);
    }

    private _mouseMoveHandler(event: MouseEvent): void {
        this._setMouse(event);
    }

    private _mouseOutHandler(_event: MouseEvent): void {
        this._mouse.set(-1000000, -1000000);
    }

    private _mouseLeaveHandler(_event: MouseEvent): void {
        this._mouse.set(-1000000, -1000000);
    }

    private _getRelativeToCanvasPosition(event: MouseEvent) {
        const canvas = this._engine.domElement;
        const rect = this._engine.domElement.getBoundingClientRect();
        return new Vector2(
            (event.clientX - rect.left) * canvas.width / rect.width,
            (event.clientY - rect.top) * canvas.height / rect.height
        );
    }

    private _setMouse(event: MouseEvent): void {
        const position = this._getRelativeToCanvasPosition(event);
        const normalized = new Vector2(
            (position.x / this._engine.domElement.width)   * 2 - 1,
            (position.y / this._engine.domElement.height) * -2 + 1
        );
        this._mouse.copy(normalized);
    }

}