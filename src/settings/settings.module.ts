import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.serivce';

@Module({
  imports: [ConfigModule.forFeature(configuration)],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
