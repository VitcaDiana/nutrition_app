import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { prisma } from '../prisma/prisma.client.js';
import { Role } from '../../prisma/generated/prisma/enums.js';

@Injectable()
export class ChatService {
  // Obține mesajele folosind contactId (pentru interfața de chat)
  async getMessagesByContact(userId: number, contactId: number, role: Role) {
    const conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { userId: userId, nutritionistId: contactId },
          { userId: contactId, nutritionistId: userId }
        ]
      }
    });

    if (!conversation) return [];

    return prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Salvează mesajul folosind senderRole conform schemei tale
  async saveMessage(senderId: number, receiverId: number, content: string, role: Role) {
    if (role === Role.FARMER) {
      throw new ForbiddenException("Farmers cannot use the chat");
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { userId: senderId, nutritionistId: receiverId },
          { userId: receiverId, nutritionistId: senderId }
        ]
      }
    });

    // Dacă nu există conversație între cei doi, o creăm
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: role === Role.USER ? senderId : receiverId,
          nutritionistId: role === Role.NUTRITIONIST ? senderId : receiverId,
        }
      });
    }

    return prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: content,
        senderRole: role, // Folosim senderRole din schema ta
      },
    });
  }
}