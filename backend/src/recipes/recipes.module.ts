import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service.js';
import { RecipesController } from './recipes.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports:[AuthModule],
  providers: [RecipesService],
  controllers: [RecipesController]
})
export class RecipesModule {}
