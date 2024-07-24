import { Injectable } from '@nestjs/common';
import { Referral } from './entites/referral.entity';
import { Player } from 'src/player/entities/player.entity';

@Injectable()
export class ReferralService {
  addNewReferral(referrer: Player, referee: Player) {
    const newReferral = new Referral(referrer, referee);
    referrer.referrals.add(newReferral);
  }
}
