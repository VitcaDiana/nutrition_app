import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { IngredientsService } from './ingredients.service.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { Role } from '../../prisma/generated/prisma/enums.js';

@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(Role.USER)
@Controller('ingredients')
@UseGuards(JwtAuthGuard)
export class IngredientsController {
    constructor(private service: IngredientsService){}

    @Post()
    addIngredient(
        @Body('name') name: string,
        @Body('quantity') quantity: number,
        @Body('unit') unit: string,
        @Body('category') category: string,
        @Body('expiresAt') expiresAt: string,
        @Req() req,
    ){
        return this.service.create(name,quantity,unit,category,new Date(expiresAt),req.user.sub);
    }

    @Get('mine')
    getMyIngredients(@Req() req) {
        return this.service.findMine(req.user.sub);
    }

    @Patch(':id')
    updateIngredient(
        @Param('id') id: string,
        @Body('name') name: string,
        @Body('quantity') quantity: number,
        @Body('unit') unit: string,
        @Req() req,
    ) {
        return this.service.update(+id, name, quantity, unit, req.user.sub);
    }

    @Delete(':id')
    deleteIngredient(
        @Param('id') id : string,
        @Req() req,
    ) {
        return this.service.delete(+id, req.user.sub);
    }

    @Get('expiring')
    getExpiringSoon(@Req() req){
        return this.service.findExpiresSoon(req.user.sub);
    }

    @Get('category/:category')
    getByCategory(
        @Param('category') category: string,
        @Req() req,
    ){
        return this.service.findByCategory(req.user.sub, category);
    }

    @Get('expired')
    getExpired(@Req() req){
        return this.service.findExpires(req.user.sub);
    }

    @Get('expiring/:days')
    getExpiringDays(
        @Param('days') days : string,
        @Req() req,
    ) {
        return this.service.findExpiringInDays(req.user.sub, Number(days));
    }

    @Get('status')
    getWithStatus(@Req() req) {
        return this.service.getWithStatus(req.user.sub);
    }
}
