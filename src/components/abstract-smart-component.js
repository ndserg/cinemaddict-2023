import AbstractComponent from "./abstract-component.js";

export default class AbstractSamrtComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Can't instantiate AbstractSamrtComponent, only concrete one.`);

  }

  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }
}
