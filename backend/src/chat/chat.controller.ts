import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { ChatService } from "./chat.service.js";

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('history/:contactId')
  async getHistory(@Param('contactId') contactId: string, @Req() req) {
    // Trimitem cele 3 argumente cerute de service
    return this.chatService.getMessagesByContact(req.user.sub, +contactId, req.user.role);
  }

  @Post('send')
  async sendMessage(@Body() body: { receiverId: number; content: string }, @Req() req) {
    // Trimitem cele 4 argumente cerute de service
    return this.chatService.saveMessage(
      req.user.sub, 
      body.receiverId, 
      body.content, 
      req.user.role
    );
  }
}