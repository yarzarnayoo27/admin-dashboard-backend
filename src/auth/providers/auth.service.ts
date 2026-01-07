import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/providers/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../dtos/register.dto';
import { User } from 'src/users/user.entity';
import { UserTypes } from '../types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserTypes) {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles.map((role) => role.name),
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token) {
    const payload = this.jwtService.verify(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    return {
      accessToken: this.jwtService.sign(
        {
          sub: payload.sub,
        },
        { expiresIn: '15m' },
      ),
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.usersService.createUser({
      ...registerDto,
      password: hashedPassword,
    });
  }
}
