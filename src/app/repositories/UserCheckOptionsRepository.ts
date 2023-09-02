import { UserCheckOptions } from '@app/entities/userCheckOptions';

export abstract class UserCheckOptionsRepository {
  abstract create(userCheckOptions: UserCheckOptions): Promise<void>;
  abstract update(userCheckOptions: UserCheckOptions): Promise<void>;
  abstract findByQuestionAndGame(
    question_id: string,
    game_id: string,
  ): Promise<UserCheckOptions | null>;
  abstract getUserPoints(
    student_user_id: string,
    game_id: string,
  ): Promise<number>;
}
