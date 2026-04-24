import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RecipesService } from './recipes.service.js';


@UseGuards(JwtAuthGuard)
@Controller('recipes')
export class RecipesController {
    constructor(private service: RecipesService){}

    @Get('from-fridge')
    getFromFridge(@Req() req){
        return this.service.getRecipesForUser(req.user.sub);
    }

    @Get(':id/calories')
    getCalories(@Param('id') id :string){
        return this.service.getRecipeCalories(+id);
    }

    @Post('favorite')
    saveFavorite(@Body() recipe, @Req() req){
        return this.service.saveFavorite(recipe, req.user.sub);
    }

    @Get('favorites')
    getFavorites(@Req() req){
        return this.service.getFavorites(req.user.sub);
    }
    @Get('for-me')
    getRecipesForMe(@Req() req){
        return this.service.getRecipesWithPreferences(req.user.sub);
    }

    @Get(':id')
    getDetails(@Param('id') id: string) {
         return this.service.getRecipeDetails(+id);
      }
      @Delete('favorite/:id')
      removeFavorite(@Param('id') id : string){
        return this.service.removeFavorite(+id);
      }
}
