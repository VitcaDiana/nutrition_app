import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './modules/users/users.module.js';
import { UsersService } from './modules/users/users.service.js';
import { UsersController } from './modules/users/users.controller.js';
import { RolesGuard } from './auth/roles.guard.js';
import { JwtAuthGuard } from './auth/jwt-auth.guard.js';
import { IngredientsModule } from './ingredients/ingredients.module.js';
import { ConfigModule } from '@nestjs/config';
import { RecipesModule } from './recipes/recipes.module.js';



@Module({
  imports: [UsersModule, IngredientsModule, ConfigModule.forRoot(), RecipesModule],
 // controllers: [UsersController],
 // providers: [RolesGuard,JwtAuthGuard],
})
export class AppModule {}
