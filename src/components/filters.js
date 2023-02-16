import AbstractComponent from "./abstract-component.js";

const activeClass = `main-navigation__item--active`;

const getFilterNameById = (id) => {
  return id.split(`#`)[1];
};

const createMainNavigationMarkup = (filters) => {
  return (filters.map((filter) => {
    const {id, name, count, checked} = filter;

    let counterElement = ``;
    if (id !== `all`) {
      counterElement = `<span class="main-navigation__item-count">${count}</span>`;
    }

    const isActive = checked ? `${activeClass}` : ``;
    const title = name.split(/(?=[A-Z])/).join(` `);

    return (
      `
      <a href="#${id}" class="main-navigation__item ${isActive}">${title} ${counterElement}</a>
      `
    );
  }).join(`\n`));
};

const createMainNavigationTemplate = (filters) => {
  const mainNavigationMarkup = createMainNavigationMarkup(filters);

  return (
    `<div class="main-navigation__items">
        ${mainNavigationMarkup}
      </div>

    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters);
  }

  setActiveFilter(oldFilter, newFilter) {
    this.getElement().querySelector(`[href = "#${oldFilter}"]`).classList.remove(activeClass);
    this.getElement().querySelector(`[href = "#${newFilter}"]`).classList.add(activeClass);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.href) {
        const filterName = getFilterNameById(evt.target.href);
        handler(filterName);
      }
    });
  }
}
