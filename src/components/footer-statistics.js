import AbstractComponent from "./abstract-component.js";

export const createFooterStatisticsTemplate = (count) => {
  return (
    `<p>${count} movies inside</p>`
  );
};


export default class FooterStatistics extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._count);
  }
}
