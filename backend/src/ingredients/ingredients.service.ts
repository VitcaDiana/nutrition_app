import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma/prisma.client.js';

@Injectable()
export class IngredientsService {

    create(name:string, quantity: number, unit: string, userId: number){
        return prisma.ingredient.create({
            data: {name, quantity, unit, userId,},
        });
    }
    findMine(userId:number){
        return prisma.ingredient.findMany({
            where: {userId },
        });
    }

    update(id:number, name: string, quantity: number, unit: string, userId: number){
        return prisma.ingredient.updateMany({
            where: {id, userId,},
            data: {
                name, quantity,unit
            },
        });
    }

    delete(id: number, userId: number){
        return prisma.ingredient.deleteMany({
            where:{id, userId,},
        });
    }
    
}
