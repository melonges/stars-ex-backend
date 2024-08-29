import { MikroORM } from '@mikro-orm/core';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}
  onModuleInit() {
    this.orm.getSchemaGenerator().updateSchema();
  }
}
