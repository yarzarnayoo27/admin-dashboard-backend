import { Module } from '@nestjs/common';
import { RolesService } from './providers/roles.service';
import { Role } from './role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [RolesService],
  exports: [TypeOrmModule, RolesService],
  imports: [TypeOrmModule.forFeature([Role])],
})
export class RolesModule {}
