import UiElement from "../interfaces/UiElement.ts";

export default class Toolbox extends UiElement {

    protected _name: string = "Toolbox";

    constructor() {
        super();
    }

    get domElement(): HTMLElement {
        const div = document.createElement('DIV');
        div.id = this._uuid;
        div.classList.add('toolbox');
        return div;
    }

}