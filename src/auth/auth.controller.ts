// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './providers/auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const { email, password } = loginDto;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { accessToken, refreshToken } = await this.authService.login(user);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, // true in production (HTTPS)
      sameSite: 'strict',
      path: '/auth/refresh-token',
    });
    return this.authService.login(user);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    const token = req.cookies?.refresh_token;
    return this.authService.refreshToken(token);
  }

  @Post('logout')
  logout() {
    return { message: 'Logged out successfully' };
  }
}
