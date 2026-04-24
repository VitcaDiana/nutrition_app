import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { Role } from '../../prisma/generated/prisma/enums.js';

@Controller('marketplace')
export class MarketplaceController {
    constructor(private service: MarketplaceService){}

    @Post()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.FARMER)
    create(@Body() dot, @Req() req){
        return this.service.createProduct(dot,req.user.sub);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.FARMER)
    myProduct(@Req() req){
        return this.service.getMyProducts(req.user.sub);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getAll(){
        return this.service.getAllProducts();
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.FARMER)
    async deleteProduct(@Param('id') id: string, @Req() req) {
    return this.service.delete(Number(id), req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.FARMER)
  async updateProduct(@Param('id') id:string, @Body() data: any, @Req() req){
    return this.service.updateProduct(Number(id), data, req.user.sub);
  }



}


