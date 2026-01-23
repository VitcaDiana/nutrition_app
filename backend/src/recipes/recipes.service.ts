import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma/prisma.client.js';
import axios from 'axios';

@Injectable()
export class RecipesService {

    async getRecipesForUser(userId: number){
        const ingredients = await prisma.ingredient.findMany({
            where:{userId,
                 expiresAt: {gt: new Date(),},
                 },
        });

        const names = ingredients.map(i => i.name).join(',');
        const response = await axios.get(
             'https://api.spoonacular.com/recipes/findByIngredients',
             {
                params:{
                    ingredients: names,
                    number: 5,
                    apiKey: process.env.SPOONACULAR_API_KEY,
                },
             },
        );
        return response.data;
    }

    async getRecipeCalories(recipeId: number){
        const response = await axios.get(
            `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json`,
            {
                params: {
                    apiKey: process.env.SPOONACULAR_API_KEY,
                },
            },
        );
        return response.data;
    }

    saveFavorite(recipe: any, userId: number){
        return prisma.favoriteRecipe.create({
            data:{
                recipeId: recipe.id,
                title: recipe.title,
                image: recipe.image,
                userId,
            },
        });
    }

    getFavorites(userId:number){
        return prisma.favoriteRecipe.findMany({
            where: {userId },
        });
    }

}
