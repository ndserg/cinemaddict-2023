export default class CommentsModel {
  constructor() {
    this._comments = [];

  }

  getComments() {
    return this._comments;
  }

  getFilmComments(currentFilmId) {
    const filmComments = this._comments.find((comments) => comments.filmId === currentFilmId);

    return filmComments.comments;
  }

  getFilmCommentsIdx(currentFilmId) {
    const commentsIdx = this._comments.findIndex((comments) => comments.filmId === currentFilmId);

    return commentsIdx;
  }

  setComments(filmId, comments) {
    let filmComments = {
      filmId,
      comments: Array.from(comments),
    };

    this._comments.push(filmComments);
  }

  isNewComment(filmId, comment) {
    const filmCommentsIdx = this.getFilmCommentsIdx(filmId);
    const commentIndex = this._comments[filmCommentsIdx].comments.findIndex((it) => it.id === comment.id);

    if (commentIndex === -1) {
      return true;
    }

    return false;
  }

  _removeComment(filmId, commentId) {
    const filmCommentsIdx = this.getFilmCommentsIdx(filmId);
    const commentIdx = this._comments[filmCommentsIdx].comments.findIndex((comment) => comment.id === commentId);
    this._comments[filmCommentsIdx].comments = [].concat(this._comments[filmCommentsIdx].comments.slice(0, commentIdx), this._comments[filmCommentsIdx].comments.slice(commentIdx + 1));
  }

  _addComments(filmId, comments) {
    const filmCommentsIdx = this.getFilmCommentsIdx(filmId);
    this._comments[filmCommentsIdx].comments = comments;
  }
}
