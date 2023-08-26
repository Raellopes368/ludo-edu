import { JwtService } from '@nestjs/jwt';

import { DatabaseModule } from '@infra/database/database.module';
import { Module } from '@nestjs/common';

import { CreateAuth } from '@app/use-cases/auth/create-auth';
import { AuthController } from './controllers/auth.controller';

import { CreateUser } from '@app/use-cases/user/create-user';
import { UserController } from './controllers/user.controller';
import { CreateGroups } from '@app/use-cases/user/create-groups';
import { CheckUserCanCreateAGroup } from '@app/use-cases/user/check-user-can-create-a-group';
import { GroupController } from './controllers/group.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController, AuthController, GroupController],
  providers: [
    CreateUser,
    CreateAuth,
    JwtService,
    CreateGroups,
    CheckUserCanCreateAGroup,
  ],
})
export class HttpModule {}
