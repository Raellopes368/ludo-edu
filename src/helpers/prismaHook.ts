import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export function SavePasswordHash<
  T extends Prisma.BatchPayload = Prisma.BatchPayload,
>(): Prisma.Middleware {
  return async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<T>,
  ): Promise<T> => {
    if (params.action === 'create' && params.model === 'User') {
      const password = params.args.data.password;
      params.args.data.password = await bcrypt.hash(password, 10);
    }
    return next(params);
  };
}
