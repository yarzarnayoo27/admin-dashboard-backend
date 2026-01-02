import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Role } from 'src/roles/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  public async findById(id: string) {
    const userId = Number(id);
    return await this.userRepository.findOne({
      where: { id: userId },
      //   relations: ['roles'],
    });
  }

  public async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  public async createUser(createUserDto: CreateUserDto) {
    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'viewer' },
    });

    if (!defaultRole) {
      throw new Error('Default role not found');
    }
    const newUser = this.userRepository.create({
      ...createUserDto,
      passwordHash: createUserDto.password,
      isActive: true,
      roles: [defaultRole],
    });
    return await this.userRepository.save(newUser);
  }
}
