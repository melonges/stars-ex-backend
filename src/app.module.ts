import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TelegramModule } from './telegram/telegram.module';
import { PlayerModule } from './player/player.module';
import { ReferralModule } from './referral/referral.module';
import { DatabaseModule } from './database/database.module';
import { EventModule } from './event/event.module';
import { SettingsModule } from './settings/settings.module';
import { TasksModule } from './tasks/tasks.module';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [
    AuthModule,
    TelegramModule,
    PlayerModule,
    DatabaseModule,
    ReferralModule,
    AssetsModule,
    EventModule,
    SettingsModule,
    TasksModule,
  ],
})
export class AppModule {}
