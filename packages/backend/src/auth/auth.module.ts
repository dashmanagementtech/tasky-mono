import { Module, Scope } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { refreshJwtStrategy } from './strategy/refreshToken.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CurrentUser } from 'decorators/current-user.decorator';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    refreshJwtStrategy,
    {
      provide: CurrentUser,
      useClass: CurrentUser,
      scope: Scope.REQUEST,
    },
  ],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '20m' },
    }),
  ],
  exports: [CurrentUser],
})
export class AuthModule {}
