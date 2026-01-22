import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service.js';
import { IngredientsController } from './ingredients.controller.js';
import { AuthModule } from '../auth/auth.module.js';


@Module({
  imports:[AuthModule],
  providers: [IngredientsService],
  controllers: [IngredientsController]
})
export class IngredientsModule {}
