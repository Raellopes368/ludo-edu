import { randomUUID } from 'crypto';
import { Groups } from '../groups';
import { QuestionOptions } from './QuestionOption';

interface QuestionProps {
  content: string;
  level: number;
  user_id: string;
}

export class Question {
  private props: QuestionProps;
  private _id: string;
  private _group: Groups;
  private _questionOptions: QuestionOptions[];

  constructor(props: QuestionProps, id?: string) {
    this._id = id ?? randomUUID();
    this.props = props;
  }

  get id() {
    return this._id;
  }

  get content() {
    return this.props.content;
  }

  set content(level: string) {
    this.props.content = level;
  }

  get level() {
    return this.props.level;
  }

  set level(content: number) {
    this.props.level = content;
  }

  get user_id() {
    return this.props.user_id;
  }

  set user_id(level: string) {
    this.props.user_id = level;
  }

  get group() {
    return this._group;
  }

  set group(group: Groups) {
    this._group = group;
  }

  get questionOptions() {
    return this._questionOptions;
  }

  set questionOptions(questionOptions: QuestionOptions[]) {
    this._questionOptions = questionOptions;
  }
}
