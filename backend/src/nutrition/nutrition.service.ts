import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma/prisma.client.js';

@Injectable()
export class NutritionService {
  // 1. Calcule de bază
  calculateBMR(profile: any) {
    if (profile.gender === "male") {
      return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }
  }

  calculateTDEE(bmr: number, activity: string) {
    const factors: any = { low: 1.2, medium: 1.55, high: 1.75 };
    return bmr * (factors[activity] || 1.2);
  }

  calculateTargetCalories(tdee: number, goal: string) {
    if (goal === 'cut') return tdee - 500;
    if (goal === 'bulk') return tdee + 300;
    return tdee;
  }

  async createOrUpdateProfile(data: any, userId: number) {
    return prisma.nutritionProfile.upsert({
      where: { userId },
      update: { ...data },
      create: { ...data, userId },
    });
  }

  // 3. Calcul Ținte - REPARAT: Am scos "this.prisma"
  async getTargets(userId: number) {
    const profile = await prisma.nutritionProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return null; // Returnăm null dacă nu există profil
    }

    const bmr = this.calculateBMR(profile);
    const tdee = this.calculateTDEE(bmr, profile.activityLevel);
    const calories = this.calculateTargetCalories(tdee, profile.goal);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(calories),
      protein: Math.round(profile.weight * 2),
      fat: Math.round((calories * 0.25) / 9),
      carbs: Math.round((calories - (profile.weight * 2 * 4) - (calories * 0.25)) / 4),
    };
  }

  // 4. Progres Zilnic - REPARAT: Verificare pentru "possibly undefined"
  async getDailyProgress(userId: number) {
    const targets = await this.getTargets(userId);
    
    // Fallback în cazul în care profilul nu există
    const tCalories = targets?.targetCalories || 2000;
    const tProtein = targets?.protein || 150;
    const tCarbs = targets?.carbs || 250;
    const tFat = targets?.fat || 70;

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const meals = await prisma.mealPlan.findMany({
      where: {
        userId,
        date: { gte: start, lte: end },
      },
    });

    const consumed = meals.reduce((acc, m) => ({
      calories: acc.calories + (Number(m.calories) || 0),
      protein: acc.protein + (Number(m.protein) || 0),
      carbs: acc.carbs + (Number(m.carbs) || 0),
      fat: acc.fat + (Number(m.fat) || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return {
      target: tCalories,
      consumed: consumed.calories,
      remaining: Math.max(0, tCalories - consumed.calories),
      proteinConsumed: consumed.protein,
      carbsConsumed: consumed.carbs,
      fatConsumed: consumed.fat,
      proteinTarget: tProtein,
      carbsTarget: tCarbs,
      fatTarget: tFat,
      percentage: Math.min(100, Math.round((consumed.calories / tCalories) * 100))
    };
  }

  async getFullReport(userId: number) {
    const profile = await prisma.nutritionProfile.findUnique({
      where: { userId }
    });
    
    const history = await prisma.mealPlan.groupBy({
      by: ['date'],
      where: { userId },
      _sum: {
        calories: true,
        protein: true,
        carbs: true,
        fat: true
      },
      orderBy: { date: 'desc' }
    });

    return { profile, history };
  }

  async getAllPatients(){
    return prisma.nutritionProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
  }
}