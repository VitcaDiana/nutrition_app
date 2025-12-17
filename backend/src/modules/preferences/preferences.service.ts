import { Injectable } from '@nestjs/common';
import { prisma } from '../../prisma/prisma.client.js';

@Injectable()
export class PreferencesService {
  async updatePreferences(userId: number, allergies: any, dislikes: any, conditions: any) {
    return prisma.preferences.upsert({
      where: { userId },
      update: { allergies, dislikes, conditions },
      create: { userId, allergies, dislikes, conditions },
    });
  }

  async getPreferences(userId: number) {
    return prisma.preferences.findUnique({ where: { userId } });
  }
}
