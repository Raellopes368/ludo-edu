import { randomUUID } from 'node:crypto';

export interface UserProps {
  email: string;
  password: string;
  name: string;
  type: number;
  group_id?: string;
}

export class User {
  private _id: string;
  private props: UserProps;

  constructor(props: UserProps, id?: string) {
    this._id = id ?? randomUUID();
    this.props = props;
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get group_id(): string {
    return this.props.group_id;
  }

  set group_id(group_id: string) {
    this.props.group_id = group_id;
  }

  get type(): number {
    return this.props.type;
  }

  set type(type: number) {
    this.props.type = type;
  }

  get password(): string {
    return this.props.password;
  }

  get id(): string {
    return this._id;
  }
}
