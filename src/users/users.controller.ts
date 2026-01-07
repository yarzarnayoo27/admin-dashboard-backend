import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './providers/users.service';
import { GetUsersParamDto } from './dtos/get-users-param.dto';

@Controller('/admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/{:id}')
  getUsers(@Param() getUsersParamDto: GetUsersParamDto) {
    console.log(getUsersParamDto);
    return 'Hello Users or user';
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Param() param: any) {
    return this.usersService.findById(param.id);
  }

  // @Post()
  // create
}
