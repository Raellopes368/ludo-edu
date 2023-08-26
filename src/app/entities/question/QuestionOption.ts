import { randomUUID } from 'crypto';
import { Question } from '.';

interface QuestionOptionProps {
  points: number;
  content: string;
  question_id: string;
}

export class QuestionOptions {
  private _id: string;
  private props: QuestionOptionProps;
  private _question: Question;

  constructor(props: QuestionOptionProps, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }

  get points() {
    return this.props.points;
  }

  set points(points: number) {
    this.props.points = points;
  }

  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;
  }

  get question_id() {
    return this.props.question_id;
  }

  set question_id(question_id: string) {
    this.props.question_id = question_id;
  }

  get question() {
    return this._question;
  }

  set question(question: Question) {
    this._question = question;
  }

  get id() {
    return this._id;
  }
}
