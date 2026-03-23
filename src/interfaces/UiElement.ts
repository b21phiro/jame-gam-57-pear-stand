export default abstract class UiElement {

    protected _onlyVisible: string = "All";
    protected _name: string = "Unnamed";
    protected _uuid: string = crypto.randomUUID();

    protected constructor() {}

    abstract get domElement(): HTMLElement;

    init(): void {};

    set onlyVisible(areaName: string) {
        this._onlyVisible = areaName;
    }

    get onlyVisible() {
        return this._onlyVisible;
    }

    get name() {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get uuid() {
        return this._uuid;
    }

}