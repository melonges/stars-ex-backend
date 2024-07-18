import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TelegramModule } from './telegram/telegram.module';
import { PlayerModule } from './player/player.module';
import { ReferralModule } from './referral/referral.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AuthModule,
    TelegramModule,
    PlayerModule,
    DatabaseModule,
    ReferralModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
