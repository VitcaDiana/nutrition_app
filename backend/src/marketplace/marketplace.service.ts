import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { prisma } from '../prisma/prisma.client.js';


@Injectable()
export class MarketplaceService {
    constructor() {}
   async createProduct(dto: any, farmerId: number) {
  // 1. Actualizăm datele de contact ale fermierului (address & phone)
  await prisma.user.update({
    where: { id: farmerId },
    data: { 
      address: dto.address, 
      phone: dto.phone 
    }
  });

  // 2. Creăm produsul
  return prisma.product.create({
    data: {
      name: dto.name,
      price: parseFloat(dto.price),
      quantity: parseInt(dto.quantity),
      category: dto.category,
      farmerId: farmerId
    }
  });
}

    getMyProducts(farmerId: number){
        return prisma.product.findMany({
            where:{farmerId,},
        });
    }
  async delete(id: number, farmerId: number) {
    // 1. Căutăm produsul folosind obiectul prisma importat
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    // 2. Verificăm dacă produsul există
    if (!product) {
      throw new NotFoundException('Produsul nu a fost găsit');
    }

    // 3. Verificăm dacă farmerId din baza de date coincide cu cel din token
    if (product.farmerId !== farmerId) {
      throw new UnauthorizedException('Nu ai permisiunea să ștergi acest produs');
    }

    // 4. Ștergem produsul
    return prisma.product.delete({
      where: { 
        id: id,
        farmerId: farmerId
     },
    });
  }


  async updateProduct(productId: number, data: any, farmerId: number){
    await prisma.user.update({
        where: {id: farmerId},
        data:{address: data.address, phone: data.phone}
    });
    const updated = await prisma.product.updateMany({
        where: {
            id: productId,
            farmerId: farmerId,
        },
        data: {
        name: data.name,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        category: data.category
        },
    });
    if(updated.count === 0){
        throw new NotFoundException("Produsul nu a fost gasit sau nu ai permisiunea.");
    }
    return{message: "Produs actualizat cu succes"};
  }

     getAllProducts(){
        return prisma.product.findMany({
            include:{
                farmer:{
                    select:{
                        name:true,
                        address: true,
                        phone: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    
}
