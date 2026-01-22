import { Injectable } from '@nestjs/common';
import { prisma } from '../../prisma/prisma.client';

@Injectable()
export class PreferencesService {
  // Creăm sau actualizăm preferințele unui user
  async updatePreferences(userId: number, allergies: any, dislikes: any, conditions: any) {
    return prisma.preferences.upsert({
      where: { userId },
      update: { allergies, dislikes, conditions },
      create: { userId, allergies, dislikes, conditions },
    });
  }

  // Obținem preferințele unui user
  async getPreferences(userId: number) {
    return prisma.preferences.findUnique({
      where: { userId },
    });
  }

  // Opțional: lista tuturor preferințelor (poate fi protejată cu Role)
  async findAll() {
    return prisma.preferences.findMany();
  }
}
