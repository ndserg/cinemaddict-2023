import {generateRandomInt, generateDate} from "../utils/common.js";
import {EMOTIONS} from "../const.js";

const AUTHORS = [`Tom Ford`, `Jorje Michael`, `Serge Devant`, `Lucas Arts`, `Bikov Dmitry`, `Denis Natalevic`, `Sergei Ivanov`, `Anne Wigton`, `Heinz Herald`, `Richard Weil`, `Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`];

const COMMENTS = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`];

const generateComment = () => {
  return {
    id: String(new Date() + Math.random()),
    author: AUTHORS[generateRandomInt(0, AUTHORS.length - 1)],
    comment: COMMENTS[generateRandomInt(0, COMMENTS.length - 1)],
    date: generateDate(2020, 2022, 1, 12, 1, 31),
    emotion: EMOTIONS[generateRandomInt(0, EMOTIONS.length - 1)],
  };
};

const generateComments = (count) => {
  return (new Array(count).fill(``).map(generateComment));
};

export {generateComments};
