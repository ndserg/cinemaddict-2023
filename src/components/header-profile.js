import AbstractComponent from "./abstract-component.js";
import {filmsStatistics} from "../utils/common.js";

const createHeaderProfileTemplate = (films) => {
  let profileRating = `Movie Buff`;
  if (films && films.length > 0) {
    const stat = filmsStatistics(films);
    profileRating = `${stat.topGenre}-Fighter`;
  }
  const profileAvatar = `images/bitmap@2x.png`;

  return (
    `<section class="header__profile profile">
        <p class="profile__rating">${profileRating}</p>
        <img class="profile__avatar" src="${profileAvatar}" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class HeaderProfile extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createHeaderProfileTemplate(this._films);
  }
}
