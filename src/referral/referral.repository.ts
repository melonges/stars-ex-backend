import { EntityRepository } from '@mikro-orm/postgresql';
import { Referral } from './entites/referral.entity';
import { Player } from 'src/player/entities/player.entity';
export class ReferralRepository extends EntityRepository<Referral> {
  addNewReferral(referrer: Player, referee: Player) {
    const newReferral = new Referral(referrer, referee);
    referrer.referrals.add(newReferral);
  }
}
