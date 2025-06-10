import { Controller, Post, Body } from '@nestjs/common';

import { Public } from 'decorators/public.decorator';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/create-auth.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  create(@Body() data: AuthLoginDto) {
    return this.authService.logUserIn(data);
  }
}
