import { Module } from '@nestjs/common';
import { MealplanService } from './mealplan.service.js';
import { MealplanController } from './mealplan.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports:[AuthModule],
  providers: [MealplanService],
  controllers: [MealplanController]
})
export class MealplanModule {}
