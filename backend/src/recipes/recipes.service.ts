import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma/prisma.client.js';
import axios from 'axios';

@Injectable()
export class RecipesService {
  private readonly apiKey = process.env.SPOONACULAR_API_KEY;
  private readonly baseUrl = 'https://api.spoonacular.com/recipes';

  // 1. Rețete bazate pe ce ai în frigider
  async getRecipesForUser(userId: number) {
    const ingredients = await prisma.ingredient.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
    });

    const names = ingredients.map((i) => i.name).join(',');
    
    // Specificăm <any> sau o interfață pentru a evita eroarea 'unknown'
    const response = await axios.get(`${this.baseUrl}/findByIngredients`, {
      params: {
        ingredients: names,
        number: 5,
        apiKey: this.apiKey,
      },
    });
    return response.data;
  }

  // 2. Extragere calorii 
  async getRecipeCalories(recipeId: number) {
    const response = await axios.get<any>(
      `${this.baseUrl}/${recipeId}/nutritionWidget.json`,
      {
        params: { apiKey: this.apiKey },
      },
    );

    const caloriesValue = response.data.calories; 
    const caloriesNumber = parseInt(caloriesValue);

    return {
      calories: isNaN(caloriesNumber) ? 0 : caloriesNumber,
    };
  }

  // 3. Salvare la favorite
  saveFavorite(recipe: any, userId: number) {
    return prisma.favoriteRecipe.create({
      data: {
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        userId,
      },
    });
  }

  // 4. Listă favorite
  getFavorites(userId: number) {
    return prisma.favoriteRecipe.findMany({
      where: { userId },
    });
  }

  // 5. Rețete cu preferințe și calorii incluse
  async getRecipesWithPreferences(userId: number) {
    const ingredients = await prisma.ingredient.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
    });

    const ingredientNames = ingredients.map((i) => i.name).join(',');

    const preferences = await prisma.preferences.findUnique({
      where: { userId },
    });

    const response = await axios.get<any>(`${this.baseUrl}/complexSearch`, {
      params: {
        apiKey: this.apiKey,
        includeIngredients: ingredientNames || undefined,
        intolerances: preferences?.allergies || undefined,
        excludeIngredients: preferences?.dislikes || undefined,
        addRecipeNutrition: true, 
        number: 5,
      },
    });

    return response.data.results;
  }
  // 6. Detalii complete rețetă (instrucțiuni, ingrediente, etc.)
async getRecipeDetails(recipeId: number) {
  const response = await axios.get<any>(
    `${this.baseUrl}/${recipeId}/information`,
    {
      params: { 
        apiKey: this.apiKey,
        includeNutrition: true 
      },
    },
  );
  return response.data;
}

removeFavorite(id:number){
  return prisma.favoriteRecipe.delete({
    where: {id}
  });
}
}