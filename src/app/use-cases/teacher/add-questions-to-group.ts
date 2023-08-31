import { GroupsRepository } from '@app/repositories/GroupsRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CheckUserCanAddQuestionsToGroup } from './check-user-can-add-questions-to-group';

interface AddQuestionsToGroupRequest {
  user_id: string;
  group_id: string;
  questions_id: string[];
}

@Injectable()
export class AddQuestionsToGroup {
  constructor(
    private groupsRepository: GroupsRepository,
    private checkUserCanAddQuestionsToGroup: CheckUserCanAddQuestionsToGroup,
  ) {}

  async execute({
    user_id,
    group_id,
    questions_id,
  }: AddQuestionsToGroupRequest) {
    const error = this.checkUserCanAddQuestionsToGroup.execute({
      user_id,
      group_id,
    });

    if (error) throw new HttpException(error, HttpStatus.BAD_REQUEST);

    await this.groupsRepository.addQuestionsToGroup(group_id, questions_id);
  }
}
