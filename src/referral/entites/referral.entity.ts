import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { Player } from 'src/player/entities/player.entity';
import { ReferralRepository } from '../referral.repository';

@Entity({ repository: () => ReferralRepository })
export class Referral {
  @PrimaryKey()
  id: number;

  @ManyToOne()
  // who refers someone
  referrer: Player;

  @OneToOne({ unique: true }) // being referred can only be done once
  // who is being referred
  referee: Player;

  constructor(referrer: Player, referee: Player) {
    this.referrer = referrer;
    this.referee = referee;
  }
  [EntityRepositoryType]?: ReferralRepository;
}
