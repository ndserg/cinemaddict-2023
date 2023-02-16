import AbstractComponent from "./abstract-component.js";

const activeClass = `main-navigation__item--active`;
const additionalItemClass = `main-navigation__additional`;

const createMainNavigationTemplate = () => {
  return (
    `<nav class="main-navigation">
      <a href="#stats" class="${additionalItemClass}">Stats</a>
    </nav>`
  );
};

export default class MainNavigation extends AbstractComponent {
  getTemplate() {
    return createMainNavigationTemplate();
  }

  setActiveMenuItem(item) {
    this.getElement().querySelectorAll(`a`).forEach((element) => element.classList.remove(activeClass));
    this.getElement().querySelector(`[href = "${item}"]`).classList.toggle(activeClass);
  }

  setMenuClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.href && evt.target.parentElement === this.getElement()) {
        this.setActiveMenuItem(evt.target.getAttribute(`href`));
        handler(evt.target.classList.contains(activeClass));
      } else if (evt.target.href) {
        this.setActiveMenuItem(evt.target.getAttribute(`href`));
        handler(false);
      }
    });
  }

}
