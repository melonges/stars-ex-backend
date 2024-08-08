import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/common/base.entity';
import { Player } from 'src/player/entities/player.entity';

@Entity()
export class Energy extends BaseEntity<'chargesInDay' | 'firstChargeInDay'> {
  @OneToOne({ mappedBy: 'energy' })
  player: Player;

  @Property()
  amount: number;

  @Property()
  chargesInDay = 0;

  @Property()
  firstChargeInDay = new Date(0);

  constructor(player: Player, amount: number) {
    super();
    this.player = player;
    this.amount = amount;
  }

  @Property({ persist: false })
  isNewDay() {
    return Date.now() - this.firstChargeInDay.getTime() > 86400000;
  }
}
