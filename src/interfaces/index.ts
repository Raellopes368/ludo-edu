import { Game } from '@app/entities/game';

export interface JWTReqPayload {
  user: {
    userId: string;
  };
}

export enum UserType {
  TEACHER = 1,
  STUDENT = 2,
}

export interface GameResponse {
  games: Game[];
  total_results: number;
}

export enum MinimumGameLimit {
  QUESTIONS = 25,
  PLAYERS = 2,
}
