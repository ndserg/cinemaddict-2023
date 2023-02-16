import {generateRandomInt, generateRandomArray, generateBool, generateDate} from "../utils/common.js";

const generateRate = () => {
  return Math.floor(Math.random() * 10) / 10 + generateRandomInt(1, 9);
};

const NAMES = [`The Mask of Zorro`, `Balto`, `Casper`, `I'm Mad`, `We're Back! A Dinosaur's Story`, `Cape Fear`,
  `Arachnophobia`, `Back to the Future Part III`, `Yume`, `Always`, `Dad`, `The Land Before Time`,
  `Who Framed Roger Rabbit`, `*batteries not included`, `Innerspace`, `An American Tail`,
  `Young Sherlock Holmes`, `Fandango`, `Gremlins`, `Twilight Zone: The Movie`, `Poltergeist`,
  `Continental Divide`, `Used Cars`, `I Wanna Hold Your Hand`, `The Unfinished Journey`,
  `Jurassic Park`, `Indiana Jones and the Temple of Doom`, `The Sugarland Express`, `Amblin`,
  `Slipstream`, `Firelight`, `Fighter Squad`, `Escape to Nowhere`, `The Last Gun`, `Lost Souls`,
  `Men in Black Alien Attack`, `The Locusts`, `Visions of Light`, `Back to the Future... The Ride`,
  `Return to Oz`, `Faces`, `Ace Eli and Rodger of the Skies`, `The Blues Brothers`, `Don Juan DeMarco`,
  `The Freshman`, `The Formula`, `Superman`, `The Nightcomers`, `Ultimo tango a Parigi`, `Queimada`];

const DESCRIPTIONS = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`];

const GENRES = [`Comedy`, `Triller`, `Horror`, `Drama`, `Fanatsy`];

const POSTERS = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];

const DIRECTORS = [`Tom Ford`, `Jorje Michael`, `Serge Devant`, `Lucas Arts`, `Bikov Dmitry`, `Denis Natalevic`, `Sergei Ivanov`];

const PERSONS = [`Anne Wigton`, `Heinz Herald`, `Richard Weil`, `Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`];

const COUNTRIES = [`USA`, `Finland`, `Russia`, `Germany`, `France`, `Italy`, `Spaun`, `United Kingdom`];

const AGES = [0, 14, 16, 18];

let comments = [];

const generateCommentsIds = () => {
  const commentsIds = comments.map((comment) => comment.id);
  const maxCommentsCount = 7;
  let uniqArr = new Set();
  for (let i = 0; i <= maxCommentsCount; i++) {
    uniqArr.add(commentsIds[generateRandomInt(0, 19)]);
  }
  return Array.from(uniqArr);
};

const generateFilm = () => {
  return {
    id: String(new Date() + Math.random()),
    comments: generateCommentsIds(),
    filmInfo: {
      title: NAMES[generateRandomInt(0, NAMES.length - 1)],
      alternativeTitle: `Laziness Who Sold Themselves`,
      totalRating: generateRate(),
      poster: POSTERS[generateRandomInt(0, POSTERS.length - 1)],
      ageRating: AGES[generateRandomInt(0, AGES.length - 1)],
      director: DIRECTORS[generateRandomInt(0, DIRECTORS.length - 1)],
      writers: generateRandomArray(PERSONS),
      actors: generateRandomArray(PERSONS),
      release: {
        date: generateDate(2000, 2022, 1, 12, 1, 31),
        releaseCountry: COUNTRIES[generateRandomInt(0, COUNTRIES.length - 1)],
      },
      runtime: generateRandomInt(30, 210),
      genre: generateRandomArray(GENRES),
      description: generateRandomArray(DESCRIPTIONS).join(` `)
    },
    userDetails: {
      watchlist: generateBool(),
      alreadyWatched: generateBool(),
      watchingDate: generateDate(2022, 2022, 1, 5, 1, 31),
      favorite: generateBool()
    }
  };
};

const generateFilms = (count, allComments) => {
  comments = allComments;
  return new Array(count).fill(``).map(generateFilm);
};

export {generateFilms};
