import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToOne,
} from '@mikro-orm/core';
import { Player } from 'src/player/entities/player.entity';
import { ReferralRepository } from '../referral.repository';
import { BaseEntity } from 'src/common/base.entity';

@Entity({ repository: () => ReferralRepository })
export class Referral extends BaseEntity {
  @ManyToOne()
  // who refers someone
  referrer: Player;

  @OneToOne({ unique: true }) // being referred can only be done once
  // who is being referred
  referee: Player;

  constructor(referrer: Player, referee: Player) {
    super();
    this.referrer = referrer;
    this.referee = referee;
  }
  [EntityRepositoryType]?: ReferralRepository;
}
