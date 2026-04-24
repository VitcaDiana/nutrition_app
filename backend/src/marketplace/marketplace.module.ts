import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller.js';
import { MarketplaceService } from './marketplace.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports:[AuthModule],
  controllers: [MarketplaceController],
  providers: [MarketplaceService]
})
export class MarketplaceModule {}
