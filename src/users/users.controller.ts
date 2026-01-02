import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  getProfile(@Param() param: any) {
    return this.usersService.findById(param.id);
  }
}
