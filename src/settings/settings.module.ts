import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.serivce';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Energy } from 'src/asset/entities';
import { AssetModule } from 'src/asset/asset.module';

@Module({
  imports: [
    ConfigModule.forFeature(configuration),
    MikroOrmModule.forFeature([Energy]),
    AssetModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
