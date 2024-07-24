import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PlayerModule } from 'src/player/player.module';
import { AssetModule } from 'src/asset/asset.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';

@Module({
  imports: [PlayerModule, AssetModule, ConfigModule.forFeature(configuration)],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
