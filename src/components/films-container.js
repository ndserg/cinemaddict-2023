import AbstractComponent from "./abstract-component.js";

const createFilmsContainerTemplate = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class FilmsContainer extends AbstractComponent {
  getTemplate() {
    return createFilmsContainerTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
