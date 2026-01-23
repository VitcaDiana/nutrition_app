import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma/prisma.client.js';
import { stat } from 'node:fs';

@Injectable()
export class IngredientsService {

    create(name:string, quantity: number, unit: string, category: string, expiresAt: Date, userId: number){
        return prisma.ingredient.create({
            data: {name, quantity, unit, category,expiresAt, userId,},
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

    findExpiresSoon(userId: number){
        const in3Days = new Date();
        in3Days.setDate(in3Days.getDate()+ 3);
        return prisma.ingredient.findMany({
            where:{userId,expiresAt:{
                lte: in3Days,
            },
        },
        orderBy: {expiresAt: 'asc'},
        });
    }

    findByCategory(userId:number, category: string){
        return prisma.ingredient.findMany({
            where:{userId, category},
            orderBy: {name: 'asc'},
        });
    }

    findExpires(userId: number){
        const now = new Date();
        return prisma.ingredient.findMany({
            where:{userId,expiresAt:{lt:now,},
            },
            orderBy: {expiresAt: 'asc'},
        });
    }

    findExpiringInDays(userId: number, days: number){
        const limit = new Date();
        limit.setDate(limit.getDate() + days);

        return prisma.ingredient.findMany({
            where:{userId,expiresAt:{gte: new Date(),lte: limit,},
        },
        orderBy: {expiresAt: 'asc'},
        });
    }

    getWithStatus(userId: number){
        const now = new Date ();
        const soon = new Date ();
        soon.setDate(soon.getDate()+ 3);

        return prisma.ingredient.findMany({
            where:{userId },
        }).then(items => 
            items.map(i => {
                let status = "OK";

                if(i.expiresAt && i.expiresAt < now) status = "EXPIRED";
                else if(i.expiresAt && i.expiresAt <= soon) status = "EXPIRING";

                return{...i, status };

            })
        );
    }
    
}
