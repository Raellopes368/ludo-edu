import { GroupsRepository } from '@app/repositories/GroupsRepository';
import { UserRepository } from '@app/repositories/UserRepository';
import { Injectable } from '@nestjs/common';
import { UserType } from 'src/interfaces';

interface CheckUserCanCreateAGroupRequest {
  name: string;
  teacher_owner_user_id: string;
}

@Injectable()
export class CheckUserCanCreateAGroup {
  constructor(
    private userRepository: UserRepository,
    private groupsRepository: GroupsRepository,
  ) {}

  async execute({
    teacher_owner_user_id,
    name,
  }: CheckUserCanCreateAGroupRequest) {
    const teacher = await this.userRepository.findByUserId(
      teacher_owner_user_id,
    );

    if (!teacher || teacher.type !== UserType.TEACHER) return false;

    const groupHasExists = await this.groupsRepository.findByName(name);

    if (groupHasExists) return false;

    return true;
  }
}
