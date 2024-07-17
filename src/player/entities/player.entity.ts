import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { PlayerRepository } from '../player.repository';

@Entity({ repository: () => PlayerRepository })
export class Player {
  @PrimaryKey()
  id: number;

  @Property()
  createdAt = new Date();

  // PERF: in the future better to increment the value than to look up all relations
  // @Property()
  // referralAmount: number;
  //
  //
  constructor(id: number) {
    this.id = id;
  }

  [EntityRepositoryType]?: PlayerRepository;
}
