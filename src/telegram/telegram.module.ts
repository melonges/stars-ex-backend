import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ConfigModule } from '@nestjs/config';
import { ReferralModule } from 'src/referral/referral.module';
import { PlayerModule } from 'src/player/player.module';

@Module({
  imports: [ConfigModule, ReferralModule, PlayerModule],
  providers: [TelegramService],
})
export class TelegramModule {}
