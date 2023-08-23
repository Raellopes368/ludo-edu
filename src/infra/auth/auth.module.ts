import { CreateAuth } from '@app/use-cases/auth/create-auth';
import { DatabaseModule } from '@infra/database/database.module';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  providers: [
    DatabaseModule,
    LocalStrategy,
    JwtService,
    JwtStrategy,
    CreateAuth,
  ],
  exports: [CreateAuth],
})
export class AuthModule {}
