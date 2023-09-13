import { UserRepository } from '@app/repositories/UserRepository';
import { Injectable } from '@nestjs/common';

interface SearchUsersRequest {
  term: string;
}

@Injectable()
export class SearchUsers {
  constructor(private userRepository: UserRepository) {}

  async execute({ term }: SearchUsersRequest) {
    const users = await this.userRepository.search(term);

    return {
      users,
    };
  }
}
