import {
  Entity,
  EntityRepositoryType,
  ManyToMany,
  PrimaryKey,
} from '@mikro-orm/core';
import { Player } from 'src/player/entities/player.entity';
import { ReferralRepository } from '../referral.repository';

@Entity({ repository: () => ReferralRepository })
export class Referral {
  @PrimaryKey()
  id: number;

  @ManyToMany()
  // who refers someone
  referrer: Player;

  @ManyToMany()
  // who is being referred
  referee: Player;

  constructor(referrer: Player, referee: Player) {
    this.referrer = referrer;
    this.referee = referee;
  }
  [EntityRepositoryType]?: ReferralRepository;
}
