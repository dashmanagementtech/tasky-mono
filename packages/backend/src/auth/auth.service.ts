import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
      const _user = await findUserByEmail(data.email);

      const compareHash = bcrypt.compareSync(data.password, _user.passwordHash);

      if (!compareHash) throw new NotFoundException('user not found');

      const auth = {
        token: this.jwtServce.sign({ userId: _user.id }),
        refresh: this.jwtServce.sign({ userId: _user.id }, { expiresIn: '7d' }),
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: password, ...user } = _user;

      return { user, auth } as unknown as AuthResponse;
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
