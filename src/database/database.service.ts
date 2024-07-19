import { MikroORM } from '@mikro-orm/core';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    private readonly orm: MikroORM,
    private configService: ConfigService,
  ) {}
  onModuleInit() {
    if (this.configService.get('NODE_ENV') === 'development')
      this.orm.schema.refreshDatabase();

    this.orm.getSchemaGenerator().updateSchema();
  }
}
