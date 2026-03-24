import States from "../enums/States.ts";

export default class StateManager {

    private _currentState: string = States.None;
    private _onStateChangeCallbacks: Map<string, Function[]> = new Map();

    constructor() {}

    set currentState(toState: string) {
        this._currentState = toState;
    }

    get currentState(): string {
        return this._currentState;
    }

    onChange(state: string, action: Function) {
        if (!this._onStateChangeCallbacks.has(state)) {
            this._onStateChangeCallbacks.set(state, [ action ]);
        } else {
            this._onStateChangeCallbacks.get(state)?.push(action);
        }
        console.log("STATE ACTIONS: ", this._onStateChangeCallbacks);
    }

}