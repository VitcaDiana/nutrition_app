import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { PassThrough } from 'stream';
import { Role } from '../../../prisma/generated/prisma/enums.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { Roles } from '../../auth/roles.decorator.js';
import { RolesGuard } from '../../auth/roles.guard.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    @Get()
    getAll() {
    return { message: 'users route works' };
  }

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Body('role') role: string
  ) {
    return this.usersService.createUser(email, password, name,role as any);
  }

  @Post('login')
  async login(
    @Body('email') email:string,
    @Body('password') password: string,
  ){
    return this.usersService.login(email,password);
  }

  @Get('me')
  getMe(@Req() req){
    return req.user;
  }
  @Post('create-resource')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.FARMER)
  createResource() {
    return { message: 'Resursă creată de FARMER' };
  }
  @Get('reports')
 @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NUTRITIONIST)
  viewReports() {
    return { message: 'Rapoarte pentru NUTRITIONIST' };
  }
  
}
