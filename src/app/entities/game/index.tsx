import { Replace } from '@helpers/Replace';
import { User } from '../user';
import { randomUUID } from 'crypto';

interface GameProps {
  is_started?: boolean;
  created_at: Date;
  game_level: number;
  teacher_user_id: string;
  winner_user_id?: string;
  current_player_id?: string;
}

export class Game {
  private props: GameProps;
  private _id: string;
  private _teacher: User;

  constructor(props: Replace<GameProps, { created_at?: Date }>, id?: string) {
    this.props = { ...props, created_at: props.created_at ?? new Date() };
    this._id = id ?? randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get is_started(): boolean {
    return this.props.is_started;
  }

  set is_started(is_started: boolean) {
    this.props.is_started = is_started;
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  get game_level(): number {
    return this.props.game_level;
  }

  set game_level(game_level: number) {
    this.props.game_level = game_level;
  }

  get teacher_user_id(): string {
    return this.props.teacher_user_id;
  }

  get winner_user_id(): string {
    return this.props.winner_user_id;
  }

  set winner_user_id(winner_user_id: string) {
    this.props.winner_user_id = winner_user_id;
  }

  get current_player_id(): string {
    return this.props.current_player_id;
  }

  set current_player_id(current_player_id: string) {
    this.props.current_player_id = current_player_id;
  }

  get teacher(): User {
    return this._teacher;
  }

  set teacher(teacher: User) {
    this._teacher = teacher;
  }
}
