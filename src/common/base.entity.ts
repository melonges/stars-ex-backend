import {
  BigIntType,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

export abstract class BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
  @PrimaryKey({ type: new BigIntType('number') })
  id: number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  constructor(id?: number) {
    if (id) this.id = id;
  }
}
