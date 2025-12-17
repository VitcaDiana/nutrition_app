import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { PreferencesService } from './preferences.service.js';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post(':userId')
  async update(
    @Param('userId') userId: string,
    @Body('allergies') allergies: any,
    @Body('dislikes') dislikes: any,
    @Body('conditions') conditions: any,
  ) {
    return this.preferencesService.updatePreferences(
      parseInt(userId),
      allergies,
      dislikes,
      conditions,
    );
  }

  @Get(':userId')
  async get(@Param('userId') userId: string) {
    return this.preferencesService.getPreferences(parseInt(userId));
  }
}
