import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrmConfig } from './orm.types';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<OrmConfig>) => {
        return {
          entities: ['dist/**/*.entity.js'],
          entitiesTs: ['src/**/*.entity.ts'],
          metadataProvider: TsMorphMetadataProvider,
          host: configService.getOrThrow('POSTGRES_HOST'),
          port: configService.getOrThrow('POSTGRES_PORT'),
          user: configService.getOrThrow('POSTGRES_USER'),
          password: configService.getOrThrow('POSTGRES_PASSWORD'),
          dbName: configService.getOrThrow('POSTGRES_DB'),
          driver: PostgreSqlDriver,
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
