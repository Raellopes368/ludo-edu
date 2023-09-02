import { Replace } from '@helpers/Replace';
import { randomUUID } from 'crypto';
import { QuestionOptions } from '../question/QuestionOption';

interface UserCheckOptionsProps {
  created_at: Date;
  updated_at: Date;
  student_user_id: string;
  question_option_id: string;
}

export class UserCheckOptions {
  private props: UserCheckOptionsProps;
  private _id: string;
  private _question_option: QuestionOptions;
  constructor(
    props: Replace<
      UserCheckOptionsProps,
      { created_at?: Date; updated_at?: Date }
    >,
    id?: string,
  ) {
    this.props = {
      ...props,
      created_at: props.created_at ?? new Date(),
      updated_at: props.updated_at ?? new Date(),
    };

    this._id = id ?? randomUUID();
  }

  get createdAt() {
    return this.props.created_at;
  }

  get updatedAt() {
    return this.props.updated_at;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updated_at = updatedAt;
  }

  get id() {
    return this._id;
  }

  get student_user_id() {
    return this.props.student_user_id;
  }

  set student_user_id(student_user_id: string) {
    this.props.student_user_id = student_user_id;
  }

  get question_option_id() {
    return this.props.question_option_id;
  }

  set question_option_id(question_option_id: string) {
    this.props.question_option_id = question_option_id;
  }

  get question_option() {
    return this._question_option;
  }

  set question_option(question_option: QuestionOptions) {
    this._question_option = question_option;
  }
}
