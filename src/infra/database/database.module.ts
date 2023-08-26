import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

import { UserRepository } from '@app/repositories/UserRepository';
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository';

import { GroupsRepository } from '@app/repositories/GroupsRepository';
import { PrismaGroupRepository } from './prisma/repositories/prisma-group-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: GroupsRepository,
      useClass: PrismaGroupRepository,
    },
  ],
  exports: [UserRepository, GroupsRepository],
})
export class DatabaseModule {}
