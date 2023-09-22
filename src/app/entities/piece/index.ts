import { randomUUID } from 'crypto';

interface PieceProps {
  house_position: number;
  is_started: boolean;
  is_finish_line: boolean;
  finish_line_position: number;
  student_play_game_id: string;
}

export class Piece {
  private props: PieceProps;
  private _id: string;
  constructor(props: PieceProps, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }

  get house_position() {
    return this.props.house_position;
  }

  set house_position(house_position: number) {
    this.props.house_position = house_position;
  }

  get is_started() {
    return this.props.is_started;
  }

  set is_started(is_started: boolean) {
    this.props.is_started = is_started;
  }

  get is_finish_line() {
    return this.props.is_finish_line;
  }

  set is_finish_line(is_finish_line: boolean) {
    this.props.is_finish_line = is_finish_line;
  }

  get finish_line_position() {
    return this.props.finish_line_position;
  }

  set finish_line_position(finish_line_position: number) {
    this.props.finish_line_position = finish_line_position;
  }

  get student_play_game_id() {
    return this.props.student_play_game_id;
  }

  set student_play_game_id(student_play_game_id: string) {
    this.props.student_play_game_id = student_play_game_id;
  }

  get id() {
    return this._id;
  }
}
