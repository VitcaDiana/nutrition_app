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
        @Req() req,
    ){
        return this.service.create(name,quantity,unit,req.user.sub);
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
}
