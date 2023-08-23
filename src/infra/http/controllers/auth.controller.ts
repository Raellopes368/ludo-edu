import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard';
import { CreateAuth } from '@app/use-cases/auth/create-auth';

@Controller('/sessions')
export class AuthController {
  constructor(private createAuth: CreateAuth) {}

  @UseGuards(AuthGuard('local'))
  @Post()
  async login(@Request() req) {
    return this.createAuth.login(req.user);
  }
}
