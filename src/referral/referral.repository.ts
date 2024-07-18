import { EntityRepository } from '@mikro-orm/postgresql';
import { Referral } from './entites/referral.entity';
export class ReferralRepository extends EntityRepository<Referral> {
  async addReferral(referral: Referral): Promise<void> {
    this.em.fork().persist(referral).flush();
  }
}
