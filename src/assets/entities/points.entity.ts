import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/common/base.entity';
import { Player } from 'src/player/entities/player.entity';

@Entity()
export class Points extends BaseEntity {
  @OneToOne({ mappedBy: 'points' })
  player: Player;

  @Property()
  amount: number;

  constructor(player: Player, amount: number) {
    super();
    this.player = player;
    this.amount = amount;
  }
}
