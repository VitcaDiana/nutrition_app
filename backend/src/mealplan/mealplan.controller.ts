import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { MealplanService } from './mealplan.service.js';

@UseGuards(JwtAuthGuard)
@Controller('mealplan')
export class MealplanController {
    constructor(private service: MealplanService){}

    @Post()
    addMeal(@Body() body, @Req() req){
        return this.service.createMeal(body,req.user.sub);
        
    }

    @Get('today')
    getToday(@Req() req){
        return this.service.getTodayMeals(req.user.sub);
    }

    @Get('history')
    getHistory(@Req() req){
        return this.service.getHistory(req.user.sub);
    }
    @Get('id')
    getMealDetails(@Param('id') id: string){
        return this.service.getMealWithRecipe(+id);
    }
}




