import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { AuthModule } from '../../auth/auth.module.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
 // exports: [UsersService],
})
export class UsersModule {}
