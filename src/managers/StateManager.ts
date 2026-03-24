import States from "../enums/States.ts";

export default class StateManager {

    private _currentState: string = States.None;

    constructor() {}

    set currentState(toState: string) {
        this._currentState = toState;
    }

    get currentState(): string {
        console.log('Current state: ' + this._currentState);
        return this._currentState;
    }

    toggleState(state: string) {
        if (this._currentState === state) {
            this._currentState = States.None;
            console.log('Resetting state');
        } else {
            this._currentState = state;
            console.log('Setting state to: ' + state);
        }
    }

}