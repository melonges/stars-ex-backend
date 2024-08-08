import { forwardRef, Module } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Referral } from './entites/referral.entity';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Referral]),
    forwardRef(() => TelegramModule),
  ],
  controllers: [ReferralController],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}
