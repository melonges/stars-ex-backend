import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from 'src/common/base.entity';
import { Referral } from 'src/referral/entites/referral.entity';
import { PlayerRepository } from '../player.repository';
import { Ambers } from 'src/asset/entities/ambers.entity';
import { Points } from 'src/asset/entities/points.entity';
import { TotalTapped } from 'src/asset/entities/total-tapped.entity';
import { Energy } from 'src/asset/entities/energy.entity';

@Entity({ repository: () => PlayerRepository })
export class Player extends BaseEntity {
  @Property()
  username?: string;
  @OneToOne()
  points: Points;
  @OneToOne()
  ambers: Ambers;
  @OneToOne()
  energy: Energy;
  @OneToOne()
  totalTapped: TotalTapped;

  constructor(id: number, username?: string) {
    super(id);
    this.username = username;
  }

  @OneToMany(() => Referral, (referral) => referral.referrer)
  referrals = new Collection<Referral>(this);

  [EntityRepositoryType]?: PlayerRepository;
}
