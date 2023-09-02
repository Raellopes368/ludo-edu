import { UserCheckOptions } from '@app/entities/userCheckOptions';

export abstract class UserCheckOptionsRepository {
  abstract create(userCheckOptions: UserCheckOptions): Promise<void>;
  abstract update(userCheckOptions: UserCheckOptions): Promise<void>;
  abstract findByQuestion(
    question_id: string,
  ): Promise<UserCheckOptions | null>;
  abstract getUserPoints(student_user_id: string): Promise<number>;
}
