import Movie from "../models/movie.js";
import Comment from "../models/comment.js";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedMovies = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.movie);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class API {
  constructor(api, storeMovies, storeComments) {
    this._api = api;
    this._storeMovies = storeMovies;
    this._storeComments = storeComments;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
      .then((movies) => {
        const items = createStoreStructure(movies.map((movie) => movie.toRAW()));

        this._storeMovies.setMovies(items);

        return movies;
      });
    }

    const store = Object.values(this._storeMovies.getMovies());

    return Promise.resolve(Movie.parseMovies(store));
  }

  getComments(movieId) {
    if (isOnline()) {
      return this._api.getComments(movieId)
      .then((comments) => {
        comments.map((comment) => {
          Comment.toRAW(comment);
        }
        );
        this._storeComments.setComments(movieId, comments);
        return comments;
      });
    }

    const store = Object.values(this._storeComments.getComments());

    return Promise.resolve(Comment.parseComments(store));
  }

  updateMovie(id, movie) {
    if (isOnline()) {
      return this._api.updateMovie(id, movie)
      .then((newMovie) => {
        this._storeMovies.setMovie(newMovie.id, newMovie.toRAW());

        return newMovie;
      });
    }

    const localMovie = Movie.clone(Object.assign(movie, {id}));

    this._storeMovies.setMovie(id, localMovie.toRAW());

    return Promise.resolve(localMovie);
  }

  addComment(filmId, newComment) {
    if (isOnline()) {
      return this._api.addComment(filmId, newComment)
      .then(({movie, comments}) => {
        comments.map((comment) => {
          Comment.toRAW(comment);
        }
        );
        this._storeComments.setComments(filmId, comments);
        return {movie, comments};
      });
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId)
      .then(() => this._storeComments.deleteComment(commentId));
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  sync() {
    if (isOnline()) {
      const storeMovies = Object.values(this._storeMovies.getMovies());

      return this._api.sync(storeMovies)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdMovies = getSyncedMovies(response.created);
          const updatedMovies = getSyncedMovies(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdMovies, ...updatedMovies]);

          this._store.setMovies(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
