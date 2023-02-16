import FilmCardComponent from "../components/film-card.js";
import FilmDetailsComponent from "../components/film-details.js";
import CommentsController from "../controllers/comments-controller.js";
import MovieModel from "../models/movie.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";

const body = document.querySelector(`body`);

const SHAKE_ANIMATION_TIMEOUT = 600;

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, commentsModel, onDataChange, onViewChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onCommentsChange = this._onCommentsChange.bind(this);
    this._api = api;

    this._film = null;

    this._commentsModel = commentsModel;

    this.showedCommentsController = null;

    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    this._film = film;
    const oldFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardComponent(this._film);

    if (oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    if (this._mode === Mode.POPUP) {
      this._renderFilmDetails();
    }

    this._filmCardComponent.setPopupOpenHandler(() => {
      this._renderFilmDetails();
    });

    this._filmCardComponent.setWatchlistButtonHandler((evt) => {
      evt.preventDefault();

      this._updateMovie(`watchlist`);
    });

    this._filmCardComponent.setWatchedButtonHandler((evt) => {
      evt.preventDefault();

      this._updateMovie(`alreadyWatched`);
    });

    this._filmCardComponent.setFavoriteButtonHandler((evt) => {
      evt.preventDefault();

      this._updateMovie(`favorite`);
    });
  }

  _updateMovie(changer) {
    const newFilm = MovieModel.clone(this._film);

    newFilm.userDetails[changer] = !newFilm.userDetails[changer];

    if (changer === `alreadyWatched` && newFilm.userDetails.alreadyWatched) {
      newFilm.userDetails.watchingDate = (new Date().toISOString());
    } else if (changer === `alreadyWatched`) {
      newFilm.userDetails.watchingDate = null;
    }

    this._onDataChange(this._film, newFilm);
  }

  _renderFilmDetails() {
    this._mode = Mode.POPUP;

    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmDetailsComponent = new FilmDetailsComponent(this._film);
    const filmDetailsElement = this._filmDetailsComponent.getElement();

    if (oldFilmDetailsComponent) {
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      body.appendChild(filmDetailsElement);
    }

    document.addEventListener(`keydown`, this._onEscKeyDown);

    this._filmDetailsComponent.setCloseButtonHandler((evt) => {
      evt.preventDefault();
      this.setDefaultView();
    });

    this._filmDetailsComponent.setWatchlistButtonHandler(() => {
      this._updateMovie(`watchlist`);
    });

    this._filmDetailsComponent.setWatchedButtonHandler(() => {
      this._updateMovie(`alreadyWatched`);
    });

    this._filmDetailsComponent.setFavoriteButtonHandler(() => {
      this._updateMovie(`favorite`);
    });

    this._renderComments();
  }

  _renderComments() {
    const filmDetailsElement = this._filmDetailsComponent.getElement();
    const filmDetailsCommentsContainer = filmDetailsElement.querySelector(`.form-details__bottom-container`);

    const commentsController = new CommentsController(filmDetailsCommentsContainer, this._onDataChange, this._onCommentsChange);
    commentsController.render(this._film, this._commentsModel.getFilmComments(this._film.id));

    this.showedCommentsController = commentsController;
  }

  _removefilmDetails() {
    this._mode = Mode.DEFAULT;
    this._onViewChange();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    remove(this._filmDetailsComponent);
    this._filmDetailsComponent = null;
    this._removeCommentsBlock();
  }

  _removeCommentsBlock() {
    this.showedCommentsController.destroy();
    this.showedCommentsController = null;
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removefilmDetails();
    }
  }

  _onCommentsChange(film, newFilm, comment) {
    const isNewComment = this._commentsModel.isNewComment(film.id, comment);

    if (isNewComment) {
      this._api.addComment(film.id, comment)
        .then((loadedData) => {
          this._commentsModel._addComments(film.id, loadedData.comments);
          this._onDataChange(film, loadedData.movie);
          this._removeCommentsBlock();
          this._renderComments();
        })
        .catch(() => {
          this.shake();
        });
    } else {
      this._api.deleteComment(comment.id)
      .then(() => {
        this._commentsModel._removeComment(film.id, comment.id);
        this._onDataChange(film, newFilm);
        this._removeCommentsBlock();
        this._renderComments();
      })
      .catch(() => {
        this.shake(comment.id);
        this.showedCommentsController.setDefaultData(comment.id);
      });
    }
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this.setDefaultView();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    let component = null;

    if (this._mode === Mode.DEFAULT) {
      component = this._filmCardComponent;
    } else {
      component = this._filmDetailsComponent;
    }

    component.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    component.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this.showedCommentsController.enableForm();
      component.getElement().style.animation = ``;
      component.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
