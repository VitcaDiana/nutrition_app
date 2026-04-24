import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma/prisma.client.js';

@Injectable()
export class MealplanService {
  async createMeal(data: any, userId: number) {
    const validDate = data.date ? new Date(data.date) : new Date();

    // Pregătim valorile numerice pentru a evita NaN în baza de date
    const calories = Number(data.calories) || 0;
    const protein = Number(data.protein) || 0;
    const carbs = Number(data.carbs) || 0;
    const fat = Number(data.fat) || 0;
    
    // Tratăm recipeId: dacă lipsește, îl punem 0 (sau null dacă schema permite)
    const rId = Number(data.recipeId);
    const finalRecipeId = (data.recipeId && !isNaN(rId)) ? rId : 0;

    // Folosim tipul 'any' pentru a opri erorile de tip "missing property" din TypeScript
    const mealData: any = {
      title: data.title || "Masă fără titlu",
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      mealType: data.mealType || "custom",
      date: validDate,
      userId: userId,
      recipeId: finalRecipeId,
    };

    return prisma.mealPlan.create({
      data: mealData,
    });
  }

  async getTodayMeals(userId: number) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return prisma.mealPlan.findMany({
      where: {
        userId,
        date: { gte: start, lte: end },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getHistory(userId: number) {
    return prisma.mealPlan.groupBy({
      by: ['date'],
      where: { userId },
      _sum: {
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async getMealWithRecipe(mealId: number) {
    const meal = await prisma.mealPlan.findUnique({
      where: { id: mealId },
    });

    if (!meal) return null;

    let recipeDetails: any = null;

    if (meal.recipeId && meal.recipeId !== 0) {
      recipeDetails = await prisma.favoriteRecipe.findFirst({
        where: { recipeId: meal.recipeId },
      });
    }

    return {
      ...meal,
      recipeDetails,
    };
  }

  async deleteMeal(mealId: number, userId: number) {
    return prisma.mealPlan.deleteMany({
      where: {
        id: mealId,
        userId: userId,
      },
    });
  }
}