import FilterComponent from "../components/filters.js";
import {FilterType} from "../const.js";
import {RenderPosition, render, replace} from "../utils/render.js";
import {getFilmsByFilter} from "../utils/filter.js";

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.AllMovies;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allFilms = this._moviesModel.getFilmsAll();
    const filters = Object.keys(FilterType).map((filterType) => {
      return {
        id: FilterType[filterType],
        name: filterType,
        count: getFilmsByFilter(allFilms, FilterType[filterType]).length,
        checked: FilterType[filterType] === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._filterComponent.setActiveFilter(this._activeFilterType, filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
