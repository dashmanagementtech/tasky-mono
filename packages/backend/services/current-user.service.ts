import { Injectable, Scope } from '@nestjs/common';
import { Users } from '@prisma/client'; // or your User type

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserService {
  private user: Users | null = null;

  setUser(user: Users) {
    this.user = user;
  }

  getUser(): Users {
    if (!this.user) throw new Error('User not set');
    return this.user;
  }
}
