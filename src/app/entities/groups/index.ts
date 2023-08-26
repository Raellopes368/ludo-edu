import { randomUUID } from 'crypto';
import { User } from '../user';

interface GroupsProps {
  name: string;
  description: string;
  teacher_owner_user_id: string;
  // teacher_owner         User   @relation("teacher_groups", fields: [teacher_owner_user_id], references: [user_id])
  // students
}

export class Groups {
  private props: GroupsProps;
  private _group_id: string;
  private _teacher_owner: User;
  private _students: User[];

  constructor(props: GroupsProps, id?: string) {
    this.props = props;
    this._group_id = id ?? randomUUID();
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
  }

  get teacher_owner_user_id() {
    return this.props.teacher_owner_user_id;
  }

  set teacher_owner_user_id(teacher_owner_user_id: string) {
    this.props.teacher_owner_user_id = teacher_owner_user_id;
  }

  get teacher_owner() {
    return this._teacher_owner;
  }

  set teacher_owner(teacher_owner: User) {
    this._teacher_owner = teacher_owner;
  }

  get students() {
    return this._students;
  }

  set students(students: User[]) {
    this._students = students;
  }

  get group_id() {
    return this._group_id;
  }
}
