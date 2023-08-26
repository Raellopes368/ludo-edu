import { Groups } from '@app/entities/groups';

export abstract class GroupsRepository {
  abstract create(group: Groups): Promise<void>;
  abstract getByGroupId(group_id: string): Promise<Groups>;
  abstract listByTeacherId(teacher_user_id: string): Promise<Groups[]>;
}
