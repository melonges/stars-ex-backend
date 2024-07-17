import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Player } from 'src/player/entities/player.entity';

@Entity()
export class Token {
  @PrimaryKey()
  id: number;

  @Property()
  token: string;

  @OneToOne()
  player: Player;
}
