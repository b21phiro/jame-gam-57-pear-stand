import UiElement from "../interfaces/UiElement.ts";
import TreePNG from "../assets/images/tree.png";
import MarketPNG from "../assets/images/market.png";

export default class Toggle extends UiElement {

    private _action?: Function;

    text: string = "Toggle";
    imgOnSrc: string = MarketPNG;
    imgOffSrc: string = TreePNG;
    defaultOn: boolean = false;

    constructor() {
        super();
    }

    get domElement(): HTMLElement {
        const div = document.createElement('DIV');
        div.classList.add('toggle');

        const checkbox = document.createElement('INPUT') as HTMLInputElement;
        checkbox.id = crypto.randomUUID();
        checkbox.type = 'checkbox';
        checkbox.name = 'toggle';
        checkbox.checked = this.defaultOn;
        checkbox.classList.add('toggle-checkbox');
        checkbox.addEventListener('change', this._toggleHandler.bind(this));

        const label = document.createElement('LABEL') as HTMLLabelElement;
        label.htmlFor = checkbox.id;
        label.classList.add('toggle-label');

        const imageContainerOn = document.createElement('SPAN');
        imageContainerOn.classList.add('toggle-image-container');
        label.append(imageContainerOn);

        const imageOn = document.createElement('IMG') as HTMLImageElement;
        imageOn.src = this.imgOnSrc;
        imageOn.classList.add('toggle-image');
        imageOn.alt = 'Tree';
        imageContainerOn.append(imageOn);

        const imageContainerOff = document.createElement('SPAN');
        imageContainerOff.classList.add('toggle-image-container');
        label.append(imageContainerOff);

        const imageOff = document.createElement('IMG') as HTMLImageElement;
        imageOff.src = this.imgOffSrc;
        imageOff.classList.add('toggle-image');
        imageOff.alt = 'Market';
        imageContainerOff.append(imageOff);

        div.append(checkbox, label);

        return div;
    }

    set onToggle(action: Function) {
        this._action = action;
    }

    private _toggleHandler(_e: Event) {
        const { checked } = _e.target as HTMLInputElement;
        this._action?.(checked);
    }

}