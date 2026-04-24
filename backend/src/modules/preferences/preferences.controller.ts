import { Body, Controller, Param, Post, Get, UseGuards, Req } from '@nestjs/common';
import { PreferencesService } from './preferences.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { Roles } from '../../auth/roles.decorator.js';
import { RolesGuard } from '../../auth/roles.guard.js';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyPreferencea(@Req() req){
    return this.preferencesService.getPreferences(req.user.sub);
  }

   @UseGuards(JwtAuthGuard)
   @Post('me')
   updateMyPreferences(
    @Req() req,
    @Body('allergies') allergies: string,
    @Body('dislikes') dislikes: string,
    @Body('conditions') conditions: string,
  ) {
    return this.preferencesService.updatePreferences(
      req.user.sub,
      allergies,
      dislikes,
      conditions,
    );
  }


  // doar NUTRITIONIST poate vedea preferințele unui user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('NUTRITIONIST')
  @Get(':userId')
   getUserPreferences(@Req() req, @Param('userId') userId: string) {
    return this.preferencesService.getPreferences(+userId);
  }

  // orice user cu token valid poate actualiza preferințele proprii
 
  // opțional: lista tuturor preferințelor (poate fi protejată)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('NUTRITIONIST')
  @Get()
 getAll() {
    return this.preferencesService.findAll();
  }
}
