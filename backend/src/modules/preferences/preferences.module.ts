import { Module } from '@nestjs/common';
import { PreferencesService } from './preferences.service.js';
import { PreferencesController } from './preferences.controller.js';
import { AuthModule } from '../../auth/auth.module.js';

@Module({
  imports:[AuthModule],
  controllers: [PreferencesController],
  providers: [PreferencesService],
  //exports: [PreferencesService],
})
export class PreferencesModule {}
