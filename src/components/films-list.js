import AbstractComponent from "./abstract-component.js";

const createFilmsListTemplate = () => {
  const headerTitle = `All movies. Upcoming`;

  return (
    `<section class="films-list">
        <h2 class="films-list__title visually-hidden">${headerTitle}</h2>
    </section>`
  );
};

export default class FilmsList extends AbstractComponent {
  getTemplate() {
    return createFilmsListTemplate();
  }
}
