import he from 'he';
import AbstractSmartComponent from "./abstract-smart-component.js";
import moment from "moment";
import {EMOTIONS} from "../const.js";

const DeletingText = {
  default: `Delete`,
  deleting: `Deleting...`,
};

const createCommentMarkup = (element) => {
  const {emotion, comment, author, date, id} = element;
  const commentDate = moment(date).format(`YYYY/MM/D HH:mm`);

  return (
    `<li class="film-details__comment" data-comment-id="${id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete">${DeletingText.default}</button>
        </p>
      </div>
    </li>`
  );
};

const createEmojiMarkup = (emotion) => {
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" data-emoji="${emotion}" width="30" height="30" alt="emoji">
    </label>`
  );
};

const createFilmCommentsTemplate = (comments, newEmoji, commentText) => {
  const commentsMarkup = comments.map((element) => createCommentMarkup(element)).join(`\n`);
  const EmojiMarkup = EMOTIONS.map((emotion) => createEmojiMarkup(emotion)).join(`\n`);
  const placeholderText = `Select reaction below and write comment here`;
  const newEmojiElement = newEmoji ? `<img src="images/emoji/${newEmoji}.png" width="55" height="55" alt="emoji-${newEmoji}">` : ``;
  const newMessage = commentText ? `${commentText}` : ``;

  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">
        ${commentsMarkup}
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label">
          ${newEmojiElement}
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="${placeholderText}" name="comment">${he.encode(newMessage)}</textarea>
        </label>

        <div class="film-details__emoji-list">
          ${EmojiMarkup}
        </div>
      </div>
    </section>`
  );
};

export default class FilmComments extends AbstractSmartComponent {
  constructor(comments) {
    super();

    this._comments = comments;
    this._newCommentEmoji = null;
    this._newCommentText = null;
    this._isDeleting = false;
    this._commentsAddHandler = null;
    this._commentsDeleteHandler = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmCommentsTemplate(this._comments, this._newCommentEmoji, this._newCommentText, this._externalData);
  }

  recoveryListeners() {
    this._setCommentsDeleteHandler(this._commentsDeleteHandler);
    this._setCommentsAddHandler(this._commentsAddHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  _setCommentsDeleteHandler(handler) {
    const element = this.getElement();

    element.addEventListener(`click`, handler);

    this._commentsDeleteHandler = handler;
  }

  _setCommentsAddHandler(handler) {
    const element = this.getElement();
    const commentInput = element.querySelector(`.film-details__comment-input`);

    commentInput.addEventListener(`keydown`, handler);

    this._commentsAddHandler = handler;
  }

  setData(id) {
    const element = this.getElement();
    const currentElement = element.querySelector(`[data-comment-id="${id}"]`);
    const deleteButton = currentElement.querySelector(`.film-details__comment-delete`);

    if (this._isDeleting) {
      deleteButton.textContent = DeletingText.default;
      this.enableForm();
      this._isDeleting = false;
    } else {
      deleteButton.textContent = DeletingText.deleting;
      this.disableForm();
      this._isDeleting = true;
    }
  }

  disableForm() {
    const element = this.getElement();
    const textArea = element.querySelector(`.film-details__comment-input`);
    const emojilist = element.querySelector(`.film-details__emoji-list`);
    const emojilistInputs = emojilist.querySelectorAll(`input`);
    emojilistInputs.forEach((input) => {
      input.disabled = true;
    });
    textArea.disabled = true;
    textArea.style.borderColor = `red`;
  }

  enableForm() {
    const element = this.getElement();
    const textArea = element.querySelector(`.film-details__comment-input`);
    const emojilist = element.querySelector(`.film-details__emoji-list`);
    const emojilistInputs = emojilist.querySelectorAll(`input`);
    emojilistInputs.forEach((input) => {
      input.disabled = false;
    });
    textArea.disabled = false;
    textArea.style.borderColor = `#f6f6f6`;
  }

  getCommentsData() {
    return {
      id: String(new Date() + Math.random()),
      author: `Test Author`,
      comment: this._newCommentText,
      date: new Date().toISOString(),
      emotion: this._newCommentEmoji,
    };
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const textArea = element.querySelector(`.film-details__comment-input`);
    const emojilist = element.querySelector(`.film-details__emoji-list`);

    textArea.addEventListener(`input`, (evt) => {
      if (!this._isDeleting) {
        this._newCommentText = evt.target.value;
      }
    });

    emojilist.addEventListener(`click`, (evt) => {
      if (evt.target.dataset.emoji && !this._isDeleting) {
        this._newCommentEmoji = evt.target.dataset.emoji;

        this.rerender();
      }
    });
  }
}
