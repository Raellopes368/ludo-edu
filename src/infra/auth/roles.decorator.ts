import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/interfaces';

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
