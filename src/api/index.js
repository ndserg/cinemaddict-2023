import Movie from "../models/movie.js";
import Comment from "../models/comment.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._authorization = authorization;
    this._endPoint = endPoint;
  }

  getMovies() {
    return this._load({
      url: `movies`,
    })
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  getComments(filmId) {
    return this._load({
      url: `comments/${filmId}`,
    })
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  updateMovie(oldMovieId, data) {
    return this._load({
      url: `movies/${oldMovieId}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})})
    .then((response) => response.json())
    .then(Movie.parseMovie);
  }

  addComment(filmId, comment) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(Comment.toRAW(comment)),
      headers: new Headers({"Content-Type": `application/json`})})
    .then((response) => response.json())
    .then(({movie, comments}) => {
      return {
        movie: Movie.parseMovie(movie),
        comments: Comment.parseComments(comments)
      };
    });
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE});
  }

  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
