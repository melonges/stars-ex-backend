import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TelegramModule } from './telegram/telegram.module';
import { PlayerModule } from './player/player.module';
import { ReferralModule } from './referral/referral.module';
import { DatabaseModule } from './database/database.module';
import { AssetModule } from './asset/asset.module';
import { EventModule } from './event/event.module';
import { SettingModule } from './setting/setting.module';

@Module({
  imports: [
    AuthModule,
    TelegramModule,
    PlayerModule,
    DatabaseModule,
    ReferralModule,
    AssetModule,
    EventModule,
    SettingModule,
  ],
})
export class AppModule {}
