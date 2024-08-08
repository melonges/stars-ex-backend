import {
  BigIntType,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

export abstract class BaseEntity<Optional = never> {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | Optional;
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
