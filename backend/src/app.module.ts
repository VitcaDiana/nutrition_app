import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module.js';
import { PreferencesModule } from './modules/preferences/preferences.module.js';
import { UsersService } from './modules/users/users.service';
import { PreferencesService } from './modules/preferences/preferences.service';
import { UsersController } from './modules/users/users.controller';
import { PreferencesController } from './modules/preferences/preferences.controller';

@Module({
  imports: [UsersModule, PreferencesModule],
  // controllers: [UsersController,PreferencesController],
  // providers: [UsersService,PreferencesService],
})
export class AppModule {}
