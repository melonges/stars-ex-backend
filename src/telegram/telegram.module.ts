import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { ConfigModule } from '@nestjs/config';
import { ReferralModule } from 'src/referral/referral.module';
import { PlayerModule } from 'src/player/player.module';

@Module({
  imports: [ConfigModule, ReferralModule, PlayerModule],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
