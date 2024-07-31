import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.serivce';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';

@Module({
  imports: [ConfigModule.forFeature(configuration)],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
