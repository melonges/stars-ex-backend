import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Referral } from './entites/referral.entity';
import { AssetModule } from 'src/asset/asset.module';

@Module({
  imports: [MikroOrmModule.forFeature([Referral]), AssetModule],
  controllers: [ReferralController],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}
