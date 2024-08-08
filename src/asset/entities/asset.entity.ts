import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { NativeEnumName } from 'src/database/tative-enum-name';
import { Player } from 'src/player/entities/player.entity';

@Entity()
export class Asset {
  @PrimaryKey()
  id: number;

  @Enum({
    items: () => AssetName,
    nativeEnumName: NativeEnumName.ASSET,
  })
  name: AssetName;

  @ManyToOne()
  player: Player;

  @Property()
  amount: number;

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  constructor(player: Player, name: AssetName, amount: number) {
    this.name = name;
    this.amount = amount;
    this.player = player;
  }
}

export enum AssetName {
  AR = 'AR',
  ENERGY = 'ENERGY',
  POINT = 'POINT',
  TOTAL_TAPED = 'TOTAL_TAPED',
}
