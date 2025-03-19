import API from "./api/index.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import CommentsModel from "./models/commentsModel.js";
import HeaderProfileComponent from "./components/header-profile.js";
import FilmsContainerComponent from "./components/films-container.js";
import FilterController from "./controllers/filter-controller.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import MainNavigationComponent from "./components/main-navigation.js";
import MoviesModel from "./models/movies.js";
import PageController from "./controllers/page-controller.js";
import StatsComponent from "./components/stats.js";
import {RenderPosition, render} from "./utils/render.js";

const AUTHORIZATION = `Basic dg91dfgfsdg98fd6lh=jksfD`;
const END_POINT = `https://18.ecmascript.htmlacademy.pro/cinemaddict`;

const MOVIES_STORE_PREFIX = `cinemaddict-movies`;
const MOVIES_STORE_VER = `v1`;
const MOVIES_STORE_NAME = `${MOVIES_STORE_PREFIX}-${MOVIES_STORE_VER}`;

const COMMENTS_STORE_PREFIX = `cinemaddict-comments`;
const COMMENTS_STORE_VER = `v1`;
const COMMENTS_STORE_NAME = `${COMMENTS_STORE_PREFIX}-${COMMENTS_STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const storeMovies = new Store(MOVIES_STORE_NAME, window.localStorage);
const storeComments = new Store(COMMENTS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, storeMovies, storeComments);

const movieModel = new MoviesModel();
const commentsModel = new CommentsModel();

const body = document.querySelector(`body`);
const siteHeaderElement = body.querySelector(`.header`);
const siteMainElement = body.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);


const mainNavigationComponent = new MainNavigationComponent();
const mainNavigationComponentElement = mainNavigationComponent.getElement();
const filterController = new FilterController(mainNavigationComponentElement, movieModel);

const filmsContainerComponent = new FilmsContainerComponent();
const pageController = new PageController(filmsContainerComponent, movieModel, commentsModel, apiWithProvider);
const statsComponent = new StatsComponent(movieModel);

render(siteMainElement, mainNavigationComponent, RenderPosition.BEFOREEND);
filterController.render();


render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
statsComponent.hide();


mainNavigationComponent.setMenuClick((isActive) => {
  if (isActive) {
    pageController.hide();
    statsComponent.show();
    statsComponent.setFilterChangeHandler();
  } else {
    pageController.show();
    statsComponent.removeFilterChangeHandler();
    statsComponent.hide();
  }
});

const renderAfterLoad = (response) => {
  movieModel.setFilms(response);
  const films = movieModel.getFilmsAll(response);

  const getFilmComments = (filmId) => {
    apiWithProvider.getComments(filmId)
      .then((comments) => commentsModel.setComments(filmId, comments));
  };

  films.forEach((film) => getFilmComments(film.id));


  const headerProfileComponent = new HeaderProfileComponent(films);
  const footerStatisticsComponent = new FooterStatisticsComponent(films.length);

  render(siteHeaderElement, headerProfileComponent, RenderPosition.BEFOREEND);
  render(footerStatisticsElement, footerStatisticsComponent, RenderPosition.BEFOREEND);

  pageController.render();
};

apiWithProvider.getMovies()
  .then((movies) => renderAfterLoad(movies));

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
