import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Referral } from './entites/referral.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Referral])],
  controllers: [ReferralController],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}
