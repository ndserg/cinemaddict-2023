export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.comment = data[`comment`];
    this.date = data[`date`];
    this.emotion = data[`emotion`];

  }

  static toRAW(comment) {
    return {
      "id": comment.id,
      "author": comment.author,
      "comment": comment.comment,
      "date": comment.date,
      "emotion": comment.emotion
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }


  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  static clone(data) {
    return new Comment(data.toRAW());
  }
}
