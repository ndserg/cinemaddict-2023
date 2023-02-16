import SortComponent, {SortType} from "../components/sort.js";
import FilmsListComponent from "../components/films-list.js";
import FilmsListContainerComponent from "../components/films-list-container.js";
import ButtonShowMoreComponent from "../components/show-more-button.js";
import FilmsListExtraContainerComponent from "../components/films-list-extra-container.js";
import NoDataComponent from "../components/no-data.js";
import MovieController from "./movie-controller.js";
import {RenderPosition, render, remove} from "../utils/render.js";

const FILM_CARDS_TO_SHOW = 5;
const FILM_CARDS_TO_SHOW_BY_BUTTON = 5;
const FILM_EXTRA_CARDS = 2;

const body = document.querySelector(`body`);
const siteMainElement = body.querySelector(`.main`);

const renderFilms = (filmsListContainerElement, films, commentsModel, onDataChange, onViewChange, api) => {
  return films.map((film) => {
    const movieController = new MovieController(filmsListContainerElement, commentsModel, onDataChange, onViewChange, api);
    movieController.render(film);
    return movieController;
  });
};

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];

  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.rating:
      sortedFilms = showingFilms.sort((a, b) => a.filmInfo.totalRating - b.filmInfo.totalRating);
      break;
    case SortType.date:
      sortedFilms = showingFilms.sort((a, b) => new Date(a.filmInfo.release.date) - new Date(b.filmInfo.release.date));
      break;
    case SortType.default:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class PageController {
  constructor(container, movieModel, commentsModel, api) {
    this._container = container;
    this._movieModel = movieModel;
    this._commentsModel = commentsModel;
    this._api = api;

    this._showingCardsCount = FILM_CARDS_TO_SHOW;

    this._showedMovieControllers = [];
    this._showedExtraFilmsControllers = [];
    this._sortComponent = new SortComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._filmsListContainerComponent = new FilmsListContainerComponent();
    this._buttonShowMoreComponent = new ButtonShowMoreComponent();
    this._noDataComponent = new NoDataComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._movieModel.setFilterChangeHandler(this._onFilterChange);

    this._filmsListContainerTopRatedComponent = new FilmsListContainerComponent();
    this._filmsListContainerMostCommentedComponent = new FilmsListContainerComponent();
    this._filmsListExtraContainerTopRatedComponent = new FilmsListExtraContainerComponent(`Top rated`);
    this._filmsListExtraContainerMostCommentedComponent = new FilmsListExtraContainerComponent(`Most commented`);
  }

  show() {
    this._sortComponent.resetSortType();
    this._sortComponent.show();
    this._container.show();
  }

  hide() {
    this._sortComponent.resetSortType();
    this._sortComponent.hide();
    this._container.hide();
  }

  render() {
    const films = this._movieModel.getFilms();

    const filmsListElement = this._filmsListComponent.getElement();
    const siteFilmsContainerElement = this._container.getElement();

    render(siteMainElement, this._sortComponent, RenderPosition.BEFOREEND);
    render(siteMainElement, this._container, RenderPosition.BEFOREEND);

    if (films.length === 0) {
      render(siteFilmsContainerElement, this._noDataComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(siteFilmsContainerElement, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(filmsListElement, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

    this._renderFilms(films.slice(0, this._showingCardsCount));

    this._renderShowMoreButton();
  }

  _renderFilms(films) {
    const filmsListContainerElement = this._filmsListContainerComponent.getElement();

    const newFilms = renderFilms(filmsListContainerElement, films, this._commentsModel, this._onDataChange, this._onViewChange, this._api);
    this._showedMovieControllers = this._showedMovieControllers.concat(newFilms);
    this._showingCardsCount = this._showedMovieControllers.length;

    this._renderExtraFilms();
  }

  _renderExtraFilms() {
    const films = this._movieModel.getFilms();
    const topRatedFilms = films.slice().sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, FILM_EXTRA_CARDS);

    const mostCommentedFilms = films.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, FILM_EXTRA_CARDS);

    const siteFilmsContainerElement = this._container.getElement();

    if (topRatedFilms.length > 0) {
      const filmsListContainerTopRatedElement = this._filmsListContainerTopRatedComponent.getElement();
      const filmsListExtraContainerTopRatedElement = this._filmsListExtraContainerTopRatedComponent.getElement();

      render(filmsListExtraContainerTopRatedElement, this._filmsListContainerTopRatedComponent, RenderPosition.BEFOREEND);
      render(siteFilmsContainerElement, this._filmsListExtraContainerTopRatedComponent, RenderPosition.BEFOREEND);

      const newTopFilms = renderFilms(filmsListContainerTopRatedElement, topRatedFilms, this._commentsModel, this._onDataChange, this._onViewChange, this._api);
      this._showedExtraFilmsControllers = this._showedExtraFilmsControllers.concat(newTopFilms);
    }

    if (mostCommentedFilms.length > 0) {
      const filmsListContainerMostCommentedElement = this._filmsListContainerMostCommentedComponent.getElement();
      const filmsListExtraContainerMostCommentedElement = this._filmsListExtraContainerMostCommentedComponent.getElement();

      render(siteFilmsContainerElement, this._filmsListExtraContainerMostCommentedComponent, RenderPosition.BEFOREEND);
      render(filmsListExtraContainerMostCommentedElement, this._filmsListContainerMostCommentedComponent, RenderPosition.BEFOREEND);

      const newMostCommentedFilms = renderFilms(filmsListContainerMostCommentedElement, mostCommentedFilms, this._commentsModel, this._onDataChange, this._onViewChange, this._api);
      this._showedExtraFilmsControllers = this._showedExtraFilmsControllers.concat(newMostCommentedFilms);
    }
  }

  _removeFilms() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];

    this._showedExtraFilmsControllers.forEach((movieController) => movieController.destroy());
    this._showedExtraFilmsControllers = [];
  }

  _renderShowMoreButton() {
    const films = this._movieModel.getFilms();
    if (this._showingCardsCount >= films.length) {
      return;
    }

    const filmsListElement = this._filmsListComponent.getElement();
    const filmsListContainerElement = this._filmsListContainerComponent.getElement();

    render(filmsListElement, this._buttonShowMoreComponent, RenderPosition.BEFOREEND);

    this._buttonShowMoreComponent.setClickHandler(() => {
      const prevFilmCardsCount = this._showingCardsCount;
      this._showingCardsCount = this._showingCardsCount + FILM_CARDS_TO_SHOW_BY_BUTTON;

      const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevFilmCardsCount, this._showingCardsCount);
      const newFilms = renderFilms(filmsListContainerElement, sortedFilms, this._commentsModel, this._onDataChange, this._onViewChange, this._api);

      this._showedMovieControllers = this._showedMovieControllers.concat(newFilms);

      if (this._showingCardsCount >= films.length) {
        remove(this._buttonShowMoreComponent);
      }
    });
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._movieModel.getFilms().slice(0, count));

    remove(this._buttonShowMoreComponent);
    this._showingCardsCount = count;
    this._renderShowMoreButton();
  }

  _onDataChange(oldData, newData) {
    const showedFilmCtrIdx = this._showedMovieControllers.findIndex((it) => it._film.id === oldData.id);
    const chowedExtraFilmCtrIdx = this._showedExtraFilmsControllers.findIndex((it) => it._film.id === oldData.id);

    this._api.updateMovie(oldData.id, newData)
      .then((movieModel) => {
        const isSuccess = this._movieModel.updateFilm(oldData.id, movieModel);

        if (isSuccess && showedFilmCtrIdx !== -1) {
          this._showedMovieControllers[showedFilmCtrIdx].render(movieModel, this._commentsModel.getComments());
        }

        if (isSuccess && chowedExtraFilmCtrIdx !== -1) {
          this._showedExtraFilmsControllers[chowedExtraFilmCtrIdx].render(movieModel, this._commentsModel.getComments());
        }
        this._updateFilms(this._showingCardsCount);
      })
      .catch(() => {
        this._showedMovieControllers[showedFilmCtrIdx].shake();
      });
  }

  _onSortTypeChange(sortType) {
    const sortedFilms = getSortedFilms(this._movieModel.getFilms(), sortType, 0, this._showingCardsCount);

    this._removeFilms();
    this._renderFilms(sortedFilms);

  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updateFilms(FILM_CARDS_TO_SHOW);
  }
}
