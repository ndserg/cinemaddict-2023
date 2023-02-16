import moment from "moment";
import AbstractComponent from "./abstract-component.js";

const createFilmCardTemplate = (film) => {
  const {id, filmInfo, comments, userDetails} = film;
  const {title, totalRating, release, description, genre, poster, runtime} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;
  const {date} = release;

  const releaseDate = new Date(date);

  const descriptionText = description.length < 140 ? description : description + `...`;
  const activeButtonClass = `film-card__controls-item--active`;
  const isWatched = watchlist ? activeButtonClass : ``;
  const isAlreadyWatched = alreadyWatched ? activeButtonClass : ``;
  const isFavorite = favorite ? activeButtonClass : ``;
  const commentCount = comments.length === 1 ? comments.length + ` comment` : comments.length + ` comments`;
  const duration = moment.utc(moment.duration(runtime, `minutes`).asMilliseconds()).format(`HH[h ] mm[m]`);

  return (
    `<article class="film-card" data-filmid="${id}">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
            <span class="film-card__year">${releaseDate.getFullYear()}</span>
            <span class="film-card__duration">${duration}</span>
            <span class="film-card__genre">${genre[0]}</span>
        </p>
        <img src="./${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${descriptionText}</p>
        <a class="film-card__comments">${commentCount}</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatched}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isAlreadyWatched}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite}">Mark as favorite</button>
        </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setPopupOpenHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }

  setWatchlistButtonHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  setWatchedButtonHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setFavoriteButtonHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }
}
