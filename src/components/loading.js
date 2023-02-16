import AbstractComponent from "./abstract-component.js";

const createNoDataTemplate = () => {
  const headerTitle = `Loading...`;

  return (
    `<section class="films-list">
        <h2 class="films-list__title">${headerTitle}</h2>
    </section>`
  );
};

export default class FilmsList extends AbstractComponent {
  getTemplate() {
    return createNoDataTemplate();
  }
}
