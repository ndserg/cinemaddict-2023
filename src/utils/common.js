const generateRandomInt = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const formatTime = (date) => `${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`} `;

const generateRandomArray = (arr) => {
  const randomeArray = [];
  const elementsCount = generateRandomInt(1, arr.length);

  for (let i = 0; i <= elementsCount; i++) {
    randomeArray.push(arr[generateRandomInt(0, arr.length)]);
  }

  return randomeArray;
};

const generateBool = () => {
  return Math.random() > 0.5;
};

const generateDate = (minYear, maxYear, minMonth, maxMonth, minDay, maxDay) => {
  const randomeYear = generateRandomInt(minYear, maxYear);
  const randomeMonth = randomeYear !== 2022 ? generateRandomInt(minMonth, maxMonth) : generateRandomInt(minMonth, 5);

  const dateString = randomeYear + `-` + randomeMonth + `-` + generateRandomInt(minDay, maxDay);

  const date = new Date(dateString);

  return date.toISOString();
};

const firstLetterToUppercase = (word) => {
  return word[0].toUpperCase() + word.slice(1);
};

const getGenresCount = (genres) => {
  const genresCount = {};

  for (const elem of genres) {
    genresCount[elem] = genresCount[elem] ? genresCount[elem] + 1 : 1;
  }

  return genresCount;
};

const filmsStatistics = (films) => {
  const genres = films.reduce((a, b) => (a.concat(b.filmInfo.genre)), []);
  const genresCount = getGenresCount(genres);
  const totalDuration = films.filter((film) => (film.userDetails.alreadyWatched)).map((it) => it.filmInfo.runtime).reduce((sum, current) => sum + current);
  const sortedGenres = Object.entries(genresCount).sort((a, b) => b[1] - a[1]);

  return {
    watchedFilms: films.filter((film) => (film.userDetails.alreadyWatched)).length,
    sortedGenres,
    topGenre: sortedGenres[0][0],
    durationHours: Math.floor(totalDuration / 60),
    durationMinutes: totalDuration % 60,
  };
};

export {
  generateRandomInt,
  formatTime,
  generateRandomArray,
  generateBool,
  generateDate,
  firstLetterToUppercase,
  filmsStatistics,
};
