import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { AuthLoginDto } from './dto/create-auth.dto';
import { findUserByEmail } from 'utils/helpers';
import { Projects, Tasks, Users } from '@prisma/client';

type AuthResponse<TUser extends Users = Users> = Promise<{
  user: TUser & {
    tasks: Tasks[];
    watching: Tasks[];
    projects: Projects[];
    createdProjects: Projects[];
  };
  auth: {
    token: string;
    refresh: string;
  };
}>;

@Injectable()
export class AuthService {
  constructor(private jwtServce: JwtService) {}

  async logUserIn(data: AuthLoginDto): AuthResponse {
    try {
      const user = await findUserByEmail(data.email);

      const compareHash = bcrypt.compareSync(data.password, user.passwordHash);

      if (!compareHash) throw new NotFoundException('user not found')

      const auth = {
        token: this.jwtServce.sign({ userId: user.id }),
        refresh: this.jwtServce.sign({ userId: user.id }, { expiresIn: '7d' }),
      };

      return { user, auth };
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }
}
