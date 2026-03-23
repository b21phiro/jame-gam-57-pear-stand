import UiElement from "../interfaces/UiElement.ts";

export default class Toggle extends UiElement {

    private _node: HTMLElement;
    private _action: Function;

    text: string = "Toggle";

    constructor() {
        super();
    }

    get domElement(): HTMLElement {
        const div = document.createElement('DIV');
        div.classList.add('toggle');
        this._node = div;

        const checkbox = document.createElement('INPUT') as HTMLInputElement;
        checkbox.id = crypto.randomUUID();
        checkbox.type = 'checkbox';
        checkbox.name = 'toggle';
        checkbox.addEventListener('change', this._toggleHandler.bind(this));

        const label = document.createElement('LABEL') as HTMLLabelElement;
        label.htmlFor = checkbox.id;
        label.innerText = 'Toggle';

        div.append(checkbox, label);

        return div;
    }

    set onToggle(action: Function) {
        this._action = action;
    }

    init(): void {
        console.log('init toggle');
    }

    private _toggleHandler(_e: Event) {
        const { checked } = _e.target as HTMLInputElement;
        this._action?.(checked);
    }

}