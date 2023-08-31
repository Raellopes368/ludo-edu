import { GroupsRepository } from '@app/repositories/GroupsRepository';
import { Injectable } from '@nestjs/common';

interface CheckUserCanAddQuestionsToGroupRequest {
  user_id: string;
  group_id: string;
}

@Injectable()
export class CheckUserCanAddQuestionsToGroup {
  constructor(private groupsRepository: GroupsRepository) {}

  async execute({ user_id, group_id }: CheckUserCanAddQuestionsToGroupRequest) {
    const group = await this.groupsRepository.getByGroupId(group_id);

    if (!group || group.teacher_owner?.id !== user_id)
      return 'Erro ao adicionar questões';

    return null;
  }
}
