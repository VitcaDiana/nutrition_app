import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { NutritionService } from './nutrition.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { Role } from '../../prisma/generated/prisma/enums.js';

@UseGuards(JwtAuthGuard)
@Controller('nutrition')
export class NutritionController {
    constructor(private service: NutritionService) {}

    // 1. Setează sau actualizează profilul nutrițional (greutate, înălțime, scop)
    @Post('profile')
    setProfile(@Body() body, @Req() req) {
        return this.service.createOrUpdateProfile(body, req.user.sub);
    }

    // 2. Obține țintele calculate (calorii, proteine, carbohidrați, grăsimi)
    @Get('targets')
    getTargets(@Req() req) {
        return this.service.getTargets(req.user.sub);
    }

    // 3. Obține progresul pentru ziua curentă (consumat vs rămas)
    @Get('progress')
    getProgress(@Req() req) {
        return this.service.getDailyProgress(req.user.sub);
    }

    // 4. Raport complet pentru un utilizator specific (Accesibil doar de NUTRITIONIST)
    @Get('report/:userId')
    @UseGuards(RolesGuard) // JwtAuthGuard este deja aplicat la nivel de clasă
    @Roles(Role.NUTRITIONIST)
    getUserReport(@Param('userId') id: string) {
        // Conversia parametrului id din string în number
        return this.service.getFullReport(+id);
    }

    @Get('all-patients')
    @UseGuards(RolesGuard)
    @Roles(Role.NUTRITIONIST)
    getAllPatients(){
        return this.service.getAllPatients();
    }

    
}