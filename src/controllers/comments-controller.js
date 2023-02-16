import FilmCommentsComponent from "../components/film-comments.js";
import MovieModel from "../models/movie.js";
import {RenderPosition, render, remove} from "../utils/render.js";


export default class CommentsController {
  constructor(container, onDataChange, onCommentsChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onCommentsChange = onCommentsChange;

    this._filmCommentsComponent = null;
  }

  render(film, comments) {
    this._filmCommentsComponent = new FilmCommentsComponent(comments);
    render(this._container, this._filmCommentsComponent, RenderPosition.BEFOREEND);

    this._filmCommentsComponent._setCommentsDeleteHandler((evt) => {
      evt.preventDefault();

      if (evt.target.closest(`.film-details__comment`)) {
        const commentId = evt.target.closest(`.film-details__comment`).dataset.commentId;
        this._filmCommentsComponent.setData(commentId);
        this.removeComment(film, comments, commentId);
      }
    });

    this._filmCommentsComponent._setCommentsAddHandler((evt) => {
      if (evt.key === `Enter` && evt.ctrlKey) {
        this._filmCommentsComponent.disableForm();
        const data = this._filmCommentsComponent.getCommentsData();
        this.addComment(film, data.id, data);
      }
    });
  }

  setDefaultData(commentId) {
    this._filmCommentsComponent.setData(commentId);
  }

  addComment(film, commentId, newComment) {
    const newComments = film.comments.slice();
    newComments.push(commentId);

    let newFilm = MovieModel.clone(film);
    newFilm.comments.push(commentId);

    this._onCommentsChange(film, newFilm, newComment);
  }

  removeComment(film, comments, commentId) {
    let newFilm = MovieModel.clone(film);
    newFilm.comments.filter((comment) => comment !== commentId);

    const oldComment = comments.filter((it) => it.id === commentId)[0];

    this._onCommentsChange(film, newFilm, oldComment);
  }

  destroy() {
    remove(this._filmCommentsComponent);
  }

  enableForm() {
    this._filmCommentsComponent.enableForm();
  }
}
