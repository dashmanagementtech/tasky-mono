import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { findUserById } from 'utils/helpers';
import { CurrentUser } from 'decorators/current-user.decorator'; // adjust path

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private reflector: Reflector,
    private currentUserService: typeof CurrentUser,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true, // required to access `context` or `request`
    });
  }

  async validate(req: Request, payload: { userId: string }) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      (req as any).route?.stack?.[0]?.handle, // fallback if no context
      (req as any).constructor,
    ]);

    if (isPublic) return true;

    const user = await findUserById(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    this.currentUserService.setUser(user); // ✅ set current user

    return user;
  }
}
