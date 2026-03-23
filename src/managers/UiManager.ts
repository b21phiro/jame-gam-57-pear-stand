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
        divTop.append(divTopLeft, divTopCenter, divTopRight);

        const divBottom = document.createElement('DIV');
        divBottom.classList.add('ui-bottom');

        const divBottomLeft = document.createElement('DIV');
        divBottomLeft.classList.add('ui-bottom-left');
        const divBottomCenter = document.createElement('DIV');
        divBottomCenter.classList.add('ui-bottom-center');
        const divBottomRight = document.createElement('DIV');
        divBottomRight.classList.add('ui-bottom-right');
        divBottom.append(divBottomLeft, divBottomCenter, divBottomRight);

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

    onAreaChange(currentArea: string) {
        for (const uiElement of this._uiElements) {
            if (uiElement.onlyVisible === 'All') continue;
            if (uiElement.onlyVisible === currentArea) {
                document.getElementById(uiElement.uuid)?.removeAttribute('aria-hidden');
            } else {
                document.getElementById(uiElement.uuid)?.setAttribute('aria-hidden', 'true');
            }
        }
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