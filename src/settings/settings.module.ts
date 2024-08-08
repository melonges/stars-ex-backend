import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.serivce';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AssetsModule } from 'src/assets/assets.module';
import { Energy } from 'src/assets/entities';

@Module({
  imports: [
    ConfigModule.forFeature(configuration),
    MikroOrmModule.forFeature([Energy]),
    AssetsModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
