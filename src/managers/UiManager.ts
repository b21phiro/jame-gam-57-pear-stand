import UiElement from "../interfaces/UiElement.ts";

export default class UiManager {

    private _node: HTMLElement;
    private _uiElements: UiElement[] = [];

    constructor() {}

    get domElement(): HTMLElement {
        const divContainer = document.createElement('DIV');
        divContainer.classList.add('ui-container');

        const divTop = document.createElement('DIV');
        divTop.classList.add('ui-top');

        const divTopLeft = document.createElement('DIV');
        divTopLeft.classList.add('ui-top-left');
        const divTopCenter = document.createElement('DIV');
        divTopCenter.classList.add('ui-top-center');
        const divTopRight = document.createElement('DIV');
        divTopRight.classList.add('ui-top-right');
        divTop.append(
            divTopLeft,
            divTopCenter,
            divTopRight
        );

        const divBottom = document.createElement('DIV');
        divBottom.classList.add('ui-bottom');

        const divLeft = document.createElement('DIV');
        divLeft.classList.add('ui-left');

        const divRight = document.createElement('DIV');
        divRight.classList.add('ui-right');

        divContainer.append(
            divTop,
            divBottom,
            divLeft,
            divRight
        );

        this._node = divContainer;

        return divContainer;
    }

    addUiElement(side: string, uiElement: UiElement) {
        this._traverse(this._node, (child: Element) => {
            if (child.classList.contains(side)) {
                child.appendChild(uiElement.domElement);
                uiElement.init();
                this._uiElements.push(uiElement);
            }
        })
    }

    private _traverse(node: Element, callback: Function) {
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            callback(child);
            if (child.children.length > 0) {
                this._traverse(child, callback);
            }
        }
    }

}