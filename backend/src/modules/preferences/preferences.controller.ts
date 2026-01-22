import { Body, Controller, Param, Post, Get, UseGuards } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  // doar NUTRITIONIST poate vedea preferințele unui user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('NUTRITIONIST')
  @Get(':userId')
  async get(@Param('userId') userId: string) {
    return this.preferencesService.getPreferences(parseInt(userId));
  }

  // orice user cu token valid poate actualiza preferințele proprii
  @UseGuards(JwtAuthGuard)
  @Post(':userId')
  async update(
    @Param('userId') userId: string,
    @Body('allergies') allergies: string,
    @Body('dislikes') dislikes: string,
    @Body('conditions') conditions: string,
  ) {
    return this.preferencesService.updatePreferences(
      parseInt(userId),
      allergies,
      dislikes,
      conditions,
    );
  }

  // opțional: lista tuturor preferințelor (poate fi protejată)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('NUTRITIONIST')
  @Get()
  async getAll() {
    return this.preferencesService.findAll();
  }
}
