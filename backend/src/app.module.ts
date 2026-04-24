import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module.js';;
import { IngredientsModule } from './ingredients/ingredients.module.js';
import { ConfigModule } from '@nestjs/config';
import { RecipesModule } from './recipes/recipes.module.js';
import { NutritionModule } from './nutrition/nutrition.module.js';
import { MealplanModule } from './mealplan/mealplan.module.js';
import { MarketplaceModule } from './marketplace/marketplace.module.js';
import { ChatModule } from './chat/chat.module.js';
import { PreferencesModule } from './modules/preferences/preferences.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';



@Module({
  imports: [UsersModule, IngredientsModule, ConfigModule.forRoot(), RecipesModule, NutritionModule, MealplanModule, MarketplaceModule, ChatModule,PreferencesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
