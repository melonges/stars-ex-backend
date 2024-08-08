import { forwardRef, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ConfigModule } from '@nestjs/config';
import { ReferralModule } from 'src/referral/referral.module';
import { PlayerModule } from 'src/player/player.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AssetsModule } from 'src/assets/assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    forwardRef(() => ReferralModule),
    PlayerModule,
    MikroOrmModule,
    AssetsModule,
  ],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
