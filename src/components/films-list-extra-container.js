import AbstractComponent from "./abstract-component.js";

const createFilmsListExtraContainerTemplate = (header) => {
  return (
    `<section class="films-list--extra">
        <h2 class="films-list__title">${header}</h2>
    </section>`
  );
};

export default class FilmsListExtraContainer extends AbstractComponent {
  constructor(header) {
    super();

    this._header = header;
  }

  getTemplate() {
    return createFilmsListExtraContainerTemplate(this._header);
  }
}
