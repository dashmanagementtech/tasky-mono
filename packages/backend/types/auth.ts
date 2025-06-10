import { AuthService } from '../src/auth/auth.service';

export type LoginData = Awaited<ReturnType<AuthService['logUserIn']>>