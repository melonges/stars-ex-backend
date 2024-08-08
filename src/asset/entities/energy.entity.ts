import { Entity, OneToOne, OptionalProps, Property } from '@mikro-orm/core';
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
  firstChargeInDay = new Date();

  constructor(player: Player, amount: number) {
    super();
    this.player = player;
    this.amount = amount;
  }

  isNewDay() {
    return this.firstChargeInDay.getTime() + 86400000 < Date.now();
  }
}
