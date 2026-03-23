export default abstract class UiElement {

    protected constructor() {}

    abstract get domElement(): HTMLElement;

    init(): void {};

}