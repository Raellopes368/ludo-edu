import { UserCheckOptions } from '@app/entities/userCheckOptions';
import { UserCheckOptions as UserCheckOptionsRaw } from '@prisma/client';

export class PrismaUserCheckOptionsMapper {
  static toPrisma(userCheckOptions: UserCheckOptions): UserCheckOptionsRaw {
    return {
      created_at: userCheckOptions.createdAt,
      updated_at: userCheckOptions.updatedAt,
      question_option_id: userCheckOptions.question_option_id,
      student_user_id: userCheckOptions.student_user_id,
      user_check_options_id: userCheckOptions.id,
      is_invalid: false,
    };
  }
  static toDomain(userCheckOptions: UserCheckOptionsRaw) {
    return new UserCheckOptions(
      {
        created_at: userCheckOptions.created_at,
        updated_at: userCheckOptions.updated_at,
        question_option_id: userCheckOptions.question_option_id,
        student_user_id: userCheckOptions.student_user_id,
      },
      userCheckOptions.user_check_options_id,
    );
  }
}
