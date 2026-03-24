import States from "../enums/States.ts";

export default class StateManager {

    private _currentState: string = States.None;

    constructor() {}

    set currentState(toState: string) {
        this._currentState = toState;
    }

    get currentState(): string {
        return this._currentState;
    }

}