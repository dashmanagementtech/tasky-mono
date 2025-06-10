import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { isEmpty } from 'lodash';

import { findUserById } from 'utils/helpers';

@Injectable()
export class refreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { userId: string }) {
    const user = await findUserById(payload.userId);

    if (isEmpty(user)) {
      return new UnauthorizedException();
    }

    return user;
  }
}
