import UiElement from "../interfaces/UiElement.ts";
import TreePNG from "../assets/images/tree.png";
import States from "../enums/States.ts";

export default class Toolbox extends UiElement {

    protected _name: string = "Toolbox";

    protected _toolItems: Map<string, Function> = new Map();

    constructor() {
        super();
    }

    get domElement(): HTMLElement {
        const div = document.createElement('DIV');
        div.id = this._uuid;
        div.classList.add('toolbox');
        return div;
    }

    addTool(name: string, action: Function, iconSrc: string = TreePNG) {
        if (this._toolItems.has(name)) {
            this._toolItems.delete(name);
        }
        this._toolItems.set(name, action);
        this._addToolElement(name, action, iconSrc);
    }

    handleStateChange(state: string) {
        if (!this._toolItems.has(state)) return;
        this._updateToolButtonsAriaPressedOnState(state);
    }

    handleAreaChange() {
        console.log('Area changed');
        this._updateToolButtonsAriaPressedOnState(States.None);
    }

    private _updateToolButtonsAriaPressedOnState(state: string) {
        const toolboxDomElement = document.getElementById(this._uuid);
        if (!toolboxDomElement) throw new Error('Toolbox element not found');
        for (let child of toolboxDomElement.children) {
            if (child instanceof HTMLButtonElement) {
                const name = child.name;
                if (name.includes(state)) {
                    child.setAttribute('aria-pressed', 'true');
                } else {
                    child.removeAttribute('aria-pressed');
                }
            }
        }
    }

    private _addToolElement(name: string, action: Function, iconSrc: string) {
        const div = document.getElementById(this._uuid);
        if (!div) throw new Error('Toolbox element not found');
        const button = document.createElement('BUTTON') as HTMLButtonElement;
        button.classList.add('toolbox-button');
        button.value = name;
        button.name = name + "_Tool";
        button.addEventListener('click', () => action());
        const image = document.createElement('IMG') as HTMLImageElement;
        image.classList.add('toolbox-button-image');
        image.src = iconSrc;
        image.alt = name;
        button.append(image);
        div.append(button);
    }

}