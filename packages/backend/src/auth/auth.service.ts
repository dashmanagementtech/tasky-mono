import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { AuthLoginDto } from './dto/create-auth.dto';
import { findUserByEmail } from 'utils/helpers';

@Injectable()
export class AuthService {
  constructor(private jwtServce: JwtService) { }

  async logUserIn(data: AuthLoginDto) {
    try {
      const user = await findUserByEmail(data.email);

      const compareHash = bcrypt.compareSync(data.password, user.passwordHash);

      if (!compareHash)
        return new HttpException(
          'no user with this email was found',
          HttpStatus.NOT_FOUND,
        );

      return { user };
    } catch (error: any) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
