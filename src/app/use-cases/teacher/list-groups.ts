import { GroupsRepository } from '@app/repositories/GroupsRepository';
import { Injectable } from '@nestjs/common';

interface ListGroupsRequest {
  user_id: string;
}

@Injectable()
export class ListGroups {
  constructor(private groupRepository: GroupsRepository) {}

  async execute({ user_id }: ListGroupsRequest) {
    const groups = await this.groupRepository.listByTeacherId(user_id);

    return {
      groups,
    };
  }
}
