import Area from "../interfaces/Area.ts";
import AreaName from "../enums/Areas.ts";
import {
    BoxGeometry,
    type Group,
    Mesh,
    MeshBasicMaterial, Object3D,
    Vector2,
    Vector3,
    Box3, Color, type Scene, type PerspectiveCamera,
} from "three";


import Systems from "../enums/Systems.ts";
import SowSystem from "../systems/SowSystem.ts";
import DiggingSystem from "../systems/DiggingSystem.ts";
import HarvestSystem from "../systems/HarvestSystem.ts";
import TileSelectionSystem from "../systems/TileSelectionSystem.ts";

export default class Garden extends Area {

    private _diggingSystem: DiggingSystem;
    private _harvestSystem: HarvestSystem;
    private _sowSystem: SowSystem;
    private _tileSelectionSystem: TileSelectionSystem;

    protected _gridSize: number = 9;

    private _terrainLayer: string[] = [
        'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT',
        'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT',
        'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT',
        'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT',
        'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT',
        'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT',
        'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT',
        'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT',
        'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT', 'DIRT',
    ];

    private _topLayer: string[] = [
        'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS',
        'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS',
        'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS',
        'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS',
        'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS',
        'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS',
        'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS',
        'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS',
        'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS', 'GRASS',
    ];

    private _objectLayer: string[] = [
        'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
        'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
        'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
        'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
        'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
        'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
        'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
        'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
        'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
    ];

    constructor(name: string = AreaName.Garden) {
        super(name);
        this._diggingSystem = new DiggingSystem();
        this._harvestSystem = new HarvestSystem();
        this._sowSystem = new SowSystem();
        this._tileSelectionSystem = new TileSelectionSystem();
    }

    initialize(): Promise<Group> {
        return new Promise((resolve) => {

            this._iterateLayer(this._terrainLayer, (tileType, position) => {
                switch (tileType) {
                    case 'DIRT':
                        this._addDirtTile(position, this.meshGroup);
                        break;
                    default:
                        console.warn(`Unknown terrain-layer-tile type: \"${tileType}\" at {${position.x};${position.y}}`);
                        break;
                }
            });

            this._iterateLayer(this._topLayer, (tileType, position) => {
                const terrainTile = this._getTileFrom('terrain', position);
                if (terrainTile) {
                    switch (tileType) {
                        case 'GRASS':
                            this._addGrassTile(terrainTile);
                            break;
                        case 'EMPTY':
                            this._addEmptyTopTile(terrainTile);
                            break;
                        default:
                            console.warn(`Unknown top-layer-tile type: \"${tileType}\" at {${position.x};${position.y}}`);
                            break;
                    }
                } else {
                    console.warn(`No terrain-layer-tile found at {${position.x};${position.y}}`);
                }
            });

            this._iterateLayer(this._objectLayer, (tileType, position) => {
                const terrainTile = this._getTileFrom('terrain', position) as Mesh<BoxGeometry>;
                if (terrainTile) {
                    switch (tileType) {
                        case 'TREE.PEAR':
                            this._addTree('pear', terrainTile);
                            break;
                        case 'EMPTY':
                            // Do nothing
                            break;
                        default:
                            console.warn(`Unknown object-layer-tile type: \"${tileType}\" at {${position.x};${position.y}}`);
                            break;
                    }
                }
            });

            this.meshGroup.position.set(50, 0, 50);

            this._initialized = true;

            resolve(this.meshGroup);

        });
    }

    update(mouse: Vector2, scene: Scene, camera: PerspectiveCamera): void {
        this._tileSelectionSystem.process(mouse, camera, scene);
        switch (this.activeSystem) {
            case Systems.Digging:
                this._diggingSystem.process(scene);
                break;
            case Systems.Harvesting:
                this._harvestSystem.process(scene);
                break;
            case Systems.Sowing:
                this._sowSystem.process(scene);
                break;
            case Systems.None:
                // Do nothing
                break;
            default:
                console.warn(`Unsupported system: \"${this.activeSystem}\"`);
                break;
        }
    }

    private _addDirtTile(gridPosition: Vector2, group: Group) {
        const height = 1.0;
        const dirtColor = new Color(0x012340);
        const boxMaterial = new MeshBasicMaterial({ color: dirtColor });
        const boxGeometry = new BoxGeometry(1, height, 1);
        const box = new Mesh(boxGeometry, boxMaterial);
        const position = new Vector3(
            gridPosition.x * boxGeometry.parameters.width,
            0,
            gridPosition.y * boxGeometry.parameters.depth
        );
        box.position.copy(position);
        box.name = 'Terrain';
        box.userData = {
            type: 'dirt',
            gridPosition,
        };
        group.add(box);
    }

    private _addGrassTile(terrainTile: Object3D) {
        const height = 0.1;
        const grassColor = new Color(0x00A670);
        const boxMaterial = new MeshBasicMaterial({ color: grassColor });
        const boxGeometry = new BoxGeometry(1.0, height, 1.0);
        const box = new Mesh(boxGeometry, boxMaterial);
        box.name = 'Top';
        terrainTile.add(box);
        const bbox = new Box3().setFromObject(terrainTile);
        box.position.y = bbox.max.y + height / 2;
    }

    private _addEmptyTopTile(terrainTile: Object3D) {
        const height = 0.1;
        const boxMaterial = new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.0 });
        const boxGeometry = new BoxGeometry(1.0, height, 1.0);
        const box = new Mesh(boxGeometry, boxMaterial);
        box.name = 'Top';
        terrainTile.add(box);
        const bbox = new Box3().setFromObject(terrainTile);
        box.position.y = bbox.max.y + height / 2;
    }

    private _addTree(treeType: string, terrainTile: Mesh<BoxGeometry>) {
        switch (treeType) {
            case 'pear':
                this._addPearTree(terrainTile);
                break;
            default:
                console.warn(`Unknown tree type: \"${treeType}\"`);
                break;
        }
    }

    private _addPearTree(terrainTile: Mesh<BoxGeometry>) {
        const height = 3;
        const treeMaterial = new MeshBasicMaterial({ color: 0x0000FF });
        const treeGeometry = new BoxGeometry(1.0, height, 1.0);
        const tree = new Mesh(treeGeometry, treeMaterial);
        tree.name = 'Tree.Pear';
        terrainTile.add(tree);
        tree.position.y = (terrainTile.geometry.parameters.height / 2) + height / 2;
    }

    private _iterateLayer(layer: string[], callback: (tile: string, position: Vector2) => void) {
        let x = 0,
            y = 0;
        for (let i = 0; i < layer.length; i++) {
            const tileType = layer[i];
            callback(tileType, new Vector2(x, y));
            x++;
            if (x >= this._gridSize) {
                x = 0;
                y++;
            }
        }
    }

    private _getTileFrom(layer: string, position: Vector2) {
        const group = this.meshGroup;
        if (layer === "terrain") {
            const terrainLayer = group.getObjectsByProperty('name', 'Terrain');
            if (terrainLayer.length === 0) return undefined;
            return terrainLayer.find(tile => tile.userData.gridPosition.equals(position));
        } else {
            throw new Error(`Unknown layer: \"${layer}\"`);
        }
    }

}