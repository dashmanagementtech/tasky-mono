import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { refreshJwtStrategy } from './strategy/refreshToken.strategy';
import { CurrentUserService } from 'services/current-user.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, refreshJwtStrategy, CurrentUserService],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '20m' },
    }),
  ],
  exports: [CurrentUserService],
})
export class AuthModule {}
