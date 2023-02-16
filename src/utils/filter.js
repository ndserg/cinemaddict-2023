import {FilterType, StatTypes} from "../const.js";

const getWatchlistFilms = (films) => {
  return films.filter((film) => film.userDetails.watchlist);
};

const getHistoryFilms = (films) => {
  return films.filter((film) => film.userDetails.alreadyWatched);
};

const getFavoritesFilms = (films) => {
  return films.filter((film) => film.userDetails.favorite);
};

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.AllMovies:
      return films;
    case FilterType.Watchlist:
      return getWatchlistFilms(films);
    case FilterType.History:
      return getHistoryFilms(films);
    case FilterType.Favorites:
      return getFavoritesFilms(films);
  }

  return films;
};

export const getFilmsByDate = (films, statType) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  switch (statType) {
    case StatTypes.All:
      return films;
    case StatTypes.Today:
      return films.filter((film) => new Date(film.userDetails.watchingDate) >= today);
    case StatTypes.Week:
      return films.filter((film) => new Date(film.userDetails.watchingDate) >= new Date(year, month, day - 7));
    case StatTypes.Month:
      return films.filter((film) => new Date(film.userDetails.watchingDate) >= new Date(year, month - 3, day));
    case StatTypes.Year:
      return films.filter((film) => new Date(film.userDetails.watchingDate).getFullYear() >= year - 1);
  }

  return films;
};
