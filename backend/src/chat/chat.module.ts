import { Module } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { ChatController } from './chat.controller.js';

@Module({
  imports:[AuthModule],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
