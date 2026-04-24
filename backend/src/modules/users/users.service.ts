
import { Get, Injectable, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { throwError } from 'rxjs';
import { access } from 'fs';
import { AuthService } from '../../auth/auth.service.js';
import { prisma } from '../../prisma/prisma.client.js';
import { isMapIterator } from 'util/types';
import { Role } from '../../../prisma/generated/prisma/enums.js';
import { Roles } from '../../auth/roles.decorator.js';
import { RolesGuard } from '../../auth/roles.guard.js';

@Injectable()
export class UsersService {
  async createUser(email: string, password: string, name: string, role:Role) {
    const hashed = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: { email, password: hashed, name, role: role},
    });
  }

  constructor(private authService: AuthService){}

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async login(email:string, password: string){
    const user = await prisma.user.findUnique({
      where: {email },
    });
    if(!user){
      throw new Error("User not found");
    }
    const passwordOk = await bcrypt.compare(password, user.password);

    if(!passwordOk){
      throw new Error("Invalid password");

    }
    return {
      access_token: this.authService.generateToken(user),
    };
  }

  findAll(){
    return prisma.user.findMany({
      include:{
        nutritionProfile: true,
        mealPlans: true,
      },
    });
  }
  @Get('all-patients')
@UseGuards(RolesGuard)
@Roles('NUTRITIONIST')
async getMyPatients() {
  return prisma.nutritionProfile.findMany({
    include: { user: true }
  });
}
}



