import { Groups } from '@app/entities/groups';
import { UserViewModel } from './user-view-model';

export class GroupViewModel {
  static toHTTP(group: Groups) {
    return {
      name: group.name,
      description: group.description,
      id: group.group_id,
      teacher_id: group.teacher_owner_user_id,
      teacher: group.teacher_owner
        ? UserViewModel.toHTTP(group.teacher_owner)
        : null,
      students: group.students?.map((student) => UserViewModel.toHTTP(student)),
    };
  }
}
