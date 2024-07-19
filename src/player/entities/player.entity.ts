import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Player {
  @PrimaryKey()
  id: number;

  @Property()
  createdAt = new Date();

  // @Property()
  // lastLogin = new Date();

  // PERF: in the future better to increment the value than to look up all relations
  // @Property()
  // referralAmount: number;
  //
  //
  constructor(id: number) {
    this.id = id;
  }
}
