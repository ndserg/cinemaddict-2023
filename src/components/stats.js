import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {firstLetterToUppercase, filmsStatistics} from "../utils/common.js";
import {StatTypes} from "../const.js";

const createStatsFiltersMarkup = (type, currentFilter) => {
  const isChecked = (StatTypes[type] === currentFilter) ? `checked` : ``;
  const statLabelText = firstLetterToUppercase(StatTypes[type]).replace(`-`, ` `);

  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${type}" value="${type}" ${isChecked}>
    <label for="statistic-${type}" class="statistic__filters-label">${statLabelText}</label>`
  );
};

const createStatsMarkup = (stat) => {
  return (
    `<li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${stat.watchedFilms} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${stat.durationHours} <span class="statistic__item-description">h</span> ${stat.durationMinutes} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${stat.topGenre}</p>
    </li>`
  );
};

const renderChart = (statisticCtx, films) => {
  if (films.length === 0) {
    return ``;
  }

  const stat = filmsStatistics(films);
  const statLabels = [];
  const statDatasetData = [];

  for (let pair of stat.sortedGenres) {
    statLabels.push(pair[0]);
    statDatasetData.push(pair[1]);
  }

  Chart.register(ChartDataLabels);

  return new Chart(
      statisticCtx,
      {
        type: `bar`,
        options: {
          indexAxis: `y`,
          animation: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: false,
            },
          },
          scales: {
            y: {
              ticks: {
                color: `#ffffff`,
                padding: 100,
                font: {size: 20},
              },
            },
            x: {
              ticks: {
                display: false,
              },
            },
          },
        },
        data: {
          labels: statLabels,
          datasets: [
            {
              data: statDatasetData,
              backgroundColor: `#ffe800`,
              hoverBackgroundColor: `#ffe800`,
              datalabels: {
                font: {
                  size: 20
                },
                color: `#ffffff`,
                anchor: `start`,
                align: `start`,
                offset: 40,
              }
            }
          ]
        }
      }
  );
};

const createRankMarkup = (statsData) => {
  const {title, rank, img} = statsData;

  return (
    `<p class="statistic__rank">
    ${title}
    <img class="statistic__img" src="${img}" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${rank}</span>
  </p>`
  );
};

const createStatsTemplate = (films, currentFilter) => {
  let rankMarkup = ``;
  let stat = {};

  let statsTitleData = {
    title: `Your rank`,
    rank: ``,
    img: `images/bitmap@2x.png`,
  };

  if (films.length > 0) {
    stat = filmsStatistics(films);
    statsTitleData.rank = `${stat.topGenre}-Fighter`;
    rankMarkup = createRankMarkup(statsTitleData);
  } else {
    stat.watchedFilms = 0;
    stat.stattopGenre = ``;
    stat.durationHours = 0;
    stat.durationMinutes = 0;
    stat.topGenre = ``;
  }

  const statsFiltersDescription = `Show stats:`;
  const statsFiltersMarkup = Object.keys(StatTypes).map((type) => createStatsFiltersMarkup(type, currentFilter)).join(`\n`);
  const statsMarkup = createStatsMarkup(stat);

  return (
    `<section class="statistic">
      ${rankMarkup}
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">${statsFiltersDescription}</p>
        ${statsFiltersMarkup}
      </form>

      <ul class="statistic__text-list">
        ${statsMarkup}
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Stats extends AbstractSmartComponent {
  constructor(films) {
    super();

    this._films = films;
    this._currentFilterType = StatTypes.All;
    this._statChart = null;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  getTemplate() {
    return createStatsTemplate(this._films.getFilmsForStat(this._currentFilterType), this._currentFilterType);
  }

  recoveryListeners() {
    this.setFilterChangeHandler();
  }

  show() {
    super.show();

    this._currentFilterType = StatTypes.All;
    this.rerender(this._films);
  }

  rerender(films) {
    this._films = films;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();
    const statisticCtx = element.querySelector(`.statistic__chart`);

    this._resetCharts();

    this._statChart = renderChart(statisticCtx, this._films.getFilmsForStat(this._currentFilterType), this._currentFilterType);
  }

  _resetCharts() {
    if (this._statChart) {
      this._statChart.destroy();
      this._statChart = null;
    }
  }

  _filterChangeHandler(evt) {
    this._currentFilterType = StatTypes[evt.target.value];
    this.rerender(this._films, this._filmsStat);
  }

  setFilterChangeHandler() {
    const form = this.getElement().querySelector(`.statistic__filters`);
    form.addEventListener(`change`, this._filterChangeHandler);
  }

  removeFilterChangeHandler() {
    const form = this.getElement().querySelector(`.statistic__filters`);
    form.removeEventListener(`change`, this._filterChangeHandler);
  }
}
