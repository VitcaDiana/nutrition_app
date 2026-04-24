import { Module } from '@nestjs/common';
import { NutritionService } from './nutrition.service.js';
import { NutritionController } from './nutrition.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports:[AuthModule],
  providers: [NutritionService],
  controllers: [NutritionController]
})
export class NutritionModule {}
