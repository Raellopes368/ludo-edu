import { randomUUID } from 'crypto';
import { Game } from '../game';

interface StudentsPlayGamesProps {
  game_position: number;
  start_house: number;
  finish_house: number;
  player_user_id: string;
  game_id: string;
}

export class StudentsPlayGames {
  private props: StudentsPlayGamesProps;
  private _id: string;
  private _student: string;
  private _game: Game;

  constructor(props: StudentsPlayGamesProps, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get game_position(): number {
    return this.props.game_position;
  }

  set game_position(game_position: number) {
    this.props.game_position = game_position;
  }

  get start_house(): number {
    return this.props.start_house;
  }

  set start_house(start_house: number) {
    this.props.start_house = start_house;
  }

  get finish_house(): number {
    return this.props.finish_house;
  }

  set finish_house(finish_house: number) {
    this.props.finish_house = finish_house;
  }

  get player_user_id(): string {
    return this.props.player_user_id;
  }

  set player_user_id(player_user_id: string) {
    this.props.player_user_id = player_user_id;
  }

  get game_id(): string {
    return this.props.game_id;
  }

  get student(): string {
    return this._student;
  }

  set student(student: string) {
    this._student = student;
  }

  get game(): Game {
    return this._game;
  }

  set game(game: Game) {
    this._game = game;
  }
}
