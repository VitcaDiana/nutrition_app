// src/modules/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { prisma } from '../../prisma/prisma.client.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  async createUser(email: string, password: string, name: string) {
    const hashed = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: { email, password: hashed, name },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
}



