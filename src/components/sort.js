import AbstractComponent from "./abstract-component.js";

const activeClass = `sort__button--active`;

export const SortType = {
  date: `date`,
  rating: `rating`,
  default: `default`,
};

const createSortTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#${SortType.default}" data-sort-type="${SortType.default}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#${SortType.date}" data-sort-type="${SortType.date}" class="sort__button">Sort by date</a></li>
      <li><a href="#${SortType.rating}" data-sort-type="${SortType.rating}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._sortTypeChangeHandler = null;
    this._currentSortType = SortType.default;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setActiveSortType(oldSortType, newSortType) {
    this.getElement().querySelector(`[href = "#${oldSortType}"]`).classList.remove(activeClass);
    this.getElement().querySelector(`[href = "#${newSortType}"]`).classList.add(activeClass);
  }

  resetSortType() {
    this.setActiveSortType(this._currentSortType, SortType.default);
    this._currentSortType = SortType.default;
    this._sortTypeChangeHandler(this._currentSortType);
  }

  setSortTypeChangeHandler(handler) {
    this._sortTypeChangeHandler = handler;
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this.setActiveSortType(this._currentSortType, sortType);

      this._currentSortType = sortType;

      this._sortTypeChangeHandler(this._currentSortType);
    });
  }
}
