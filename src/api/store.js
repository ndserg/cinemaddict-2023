export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getMovies() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setMovies(movies) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(movies)
    );
  }

  setMovie(key, value) {
    const movies = this.getMovies();
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, movies, {
              [key]: value
            })
        )
    );
  }

  getComments() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setComments(key, value) {
    const comments = this.getComments();
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, comments, {
              [key]: value
            })
        )
    );
  }

  deleteComment(key) {
    const comments = this.getComments();

    delete comments[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(comments)
    );
  }
}
