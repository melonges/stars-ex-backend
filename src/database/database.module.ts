import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { DatabaseConfig } from './database.types';
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<DatabaseConfig>) => {
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
          debug: process.env.NODE_ENV === 'development',
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    ConfigModule,
  ],
  exports: [MikroOrmModule],
  providers: [DatabaseService],
})
export class DatabaseModule {}
