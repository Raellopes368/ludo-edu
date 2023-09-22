import { Groups } from '@app/entities/groups';
import { GroupsRepository } from '@app/repositories/GroupsRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CheckUserCanCreateAGroup } from './check-user-can-create-a-group';

interface CreateGroupsRequest {
  name: string;
  description: string;
  teacher_owner_user_id: string;
}

@Injectable()
export class CreateGroups {
  constructor(
    private groupsRepository: GroupsRepository,
    private checkUserCanCreateAGroup: CheckUserCanCreateAGroup,
  ) {}

  async execute({
    description,
    name,
    teacher_owner_user_id,
  }: CreateGroupsRequest) {
    const userCanCreateAGroup = await this.checkUserCanCreateAGroup.execute({
      name,
      teacher_owner_user_id,
    });

    if (!userCanCreateAGroup)
      throw new HttpException(
        'Você não pode criar esse grupo',
        HttpStatus.FORBIDDEN,
      );

    const group = new Groups({
      description,
      name,
      teacher_owner_user_id,
    });

    await this.groupsRepository.create(group);

    return {
      group,
    };
  }
}
