import { Injectable } from '@nestjs/common';
import { Referral } from './entites/referral.entity';
import { Player } from 'src/player/entities/player.entity';
import { ReferralRepository } from './referral.repository';

@Injectable()
export class ReferralService {
  constructor(private readonly referralRepository: ReferralRepository) {}

  addReferralRecord(referrer: Player, referee: Player) {
    const newReferral = new Referral(referrer, referee);
    return this.referralRepository.addReferral(newReferral);
  }
}
