import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ConfigModule } from '@nestjs/config';
import { ReferralModule } from 'src/referral/referral.module';
import { PlayerModule } from 'src/player/player.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AssetModule } from 'src/asset/asset.module';

@Module({
  imports: [
    ConfigModule,
    ReferralModule,
    PlayerModule,
    MikroOrmModule,
    AssetModule,
  ],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
