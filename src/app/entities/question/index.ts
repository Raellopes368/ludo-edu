import { randomUUID } from 'crypto';
import { Groups } from '../groups';

interface QuestionProps {
  content: string;
  level: number;
  user_id: string;
  group_id: string;
}

export class Question {
  private props: QuestionProps;
  private _id: string;
  private _group: Groups;

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

  get group_id() {
    return this.props.group_id;
  }

  set group_id(level: string) {
    this.props.group_id = level;
  }

  get group() {
    return this._group;
  }

  set group(group: Groups) {
    this._group = group;
  }
}
